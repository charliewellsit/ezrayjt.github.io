import getpass, pandas as pd
from mysql.connector import connect
from mysql.connector.abstracts import MySQLConnectionAbstract

def create_db_and_tables(connection: MySQLConnectionAbstract):
	with connection.cursor() as cursor:
		cursor.execute("CREATE DATABASE IF NOT EXISTS iteration2")
		cursor.execute("USE iteration2")
		cursor.execute("""CREATE TABLE IF NOT EXISTS CFLs (
				ID INT PRIMARY KEY,
				brand VARCHAR(20),
				model_number VARCHAR(50),
				family_name VARCHAR(50),
				manufacturer_country VARCHAR(5),
				lamp_power_watts INT,
				lamp_light_lumens DOUBLE,
				colour_temperature INT,
				lamp_life_hours INT
		)""")
		cursor.execute("""CREATE TABLE IF NOT EXISTS incandescents (
				ID INT PRIMARY KEY,
				brand VARCHAR(20),
				model_number VARCHAR(50),
				family_name VARCHAR(50),
				lamp_power_watts INT,
				lamp_light_lumens DOUBLE,
				lamp_life_hours INT
		)""")
		cursor.execute("""CREATE TABLE IF NOT EXISTS incandescent_manufacturing (
				ID INT PRIMARY KEY AUTO_INCREMENT,
				incandescent_ID INT,
				manufacturer_country VARCHAR(25),
				FOREIGN KEY (incandescent_ID)
					REFERENCES incandescents(ID)
		)""")
		# If the postcode is 3 digits long then it's from NT, and all NT postcodes should be within 800 to 899
		# Other states have 4-digit postcodes
		cursor.execute("""CREATE TABLE IF NOT EXISTS waste_management_facilities (
				ID INT PRIMARY KEY,
				X DOUBLE NOT NULL,
				Y DOUBLE NOT NULL,
				facility_management_type VARCHAR(20),
				facility_infrastructure_type VARCHAR(50),
				facility_owner VARCHAR(50),
				facility_name VARCHAR(50),
				state_or_territory VARCHAR(3)
				 	CHECK (state_or_territory IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')),
				address VARCHAR(100),
				suburb VARCHAR(50),
				postcode VARCHAR(4)
				 	CHECK ((LENGTH(postcode) = 3 AND LEFT(postcode, 1) = '8') OR LENGTH(postcode) = 4)
		)""")
		connection.commit()

def load_data_into_db(connection: MySQLConnectionAbstract):
	# CFL dataset
	# Get only those sold in Australia and marked as Available
	cfls = pd.read_csv("CFLs.csv")
	cfl_sold_in_aus = cfls.SoldIn.map(lambda row: "Australia" in row)
	cfls = cfls[(cfls.Availability == "Available") & cfl_sold_in_aus].reset_index(drop = True)

	# Incandescent dataset
	# Do the same as above
	incands = pd.read_csv("incandescent.csv")
	incands_sold_in_aus = incands.SoldIn.map(lambda row: "Australia" in row)
	incands = incands[(incands["Availability Status"] == "Available") & incands_sold_in_aus].reset_index(drop = True)
	incands["Family Name"].fillna("", inplace = True)

	# Waste management dataset
	# Some addresses and facility owners are empty so we'll put an empty string instead of a "NaN" for those
	# This is also true of one facility name in Tasmania - who builds a facility and then doesn't name it??
	# Pandas makes them floats but we don't want that - instead of 2620.0 we need 2620
	waste = pd.read_csv("Waste_Management_Facilities.csv")
	waste.address.fillna("", inplace = True)
	waste.suburb.fillna("", inplace = True)
	waste.facility_owner.fillna("", inplace = True)
	waste.facility_name.fillna("", inplace = True)
	waste["postcode"] = waste.postcode.map(lambda item: "NULL" if pd.isna(item) else str(int(item)))
	
	with connection.cursor() as cursor:
		print("Starting CFLs...")
		row_data = [
			(index, row.Brand, row.Model_No, row["Family Name"], row.Country, row.nom_lamp_power, row.nom_lum_flux, row.colour_temp, row.median_lamp_life)
			for index, row in cfls.iterrows()
		]
		cursor.executemany("INSERT INTO CFLs VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", row_data)
		
		print("CFLs complete. Starting Waste Management Facilities...")
		# Don't need the index value because each row already has a unique ObjectID number that we can use
		# I can't believe the dataset misspelled "infastructure"
		row_data = [
			(row.objectid, row.X, row.Y, row.facility_management_type, row.facility_infastructure_type, row.facility_owner, row.facility_name, row.state, row.address, row.suburb, row.postcode)
			for _, row in waste.iterrows()
		]	
		cursor.executemany("INSERT INTO waste_management_facilities VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
				  row_data)
		
		print("Waste Management Facilities complete. Starting Incandescents...")
		for index, row in incands.iterrows():
			cursor.execute("INSERT INTO incandescents VALUES (%s, %s, %s, %s, %s, %s, %s)",
				  (index, row.Brand, row.Model_No, row["Family Name"], row.nom_lamp_power, row["Lamp Light Output (Lumens)"], row.median_lamp_life))
			
			# Go through the list of manufacturing countries and add each to the manufacturing table
			# The index was used as the ID for each row in the main table, so we use the same index number as the foreign key here
			assert isinstance(row.Country, str)
			for country in row.Country.split(","):
				cursor.execute("INSERT INTO incandescent_manufacturing (incandescent_ID, manufacturer_country) VALUES (%s, %s)",
				   (index, country))
		print("Incandescents complete.")
		
		connection.commit()

def main():
	with connect(host = "ta21-2023s2.mysql.database.azure.com", user = "TA21", password = getpass.getpass()) as connection:
		assert isinstance(connection, MySQLConnectionAbstract)
		print("Connected!")
		create_db_and_tables(connection)
		load_data_into_db(connection)

main()