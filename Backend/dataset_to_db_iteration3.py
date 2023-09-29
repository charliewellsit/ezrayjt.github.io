import getpass, pandas as pd
from mysql.connector import connect
from mysql.connector.abstracts import MySQLConnectionAbstract

def create_db_and_tables(connection: MySQLConnectionAbstract):
	with connection.cursor() as cursor:
		cursor.execute("CREATE DATABASE IF NOT EXISTS iteration3")
		cursor.execute("USE iteration3")
		cursor.execute("""CREATE TABLE IF NOT EXISTS Refrigerators (
				ID INT PRIMARY KEY,
				brand VARCHAR(20),
				model_number VARCHAR(120),
				family_name VARCHAR(120),
				is_refrigerator BOOLEAN,
				is_freezer BOOLEAN,
				energy_usage_kwh_per_month NUMERIC(10,5),
				total_volume_litres INT,
				star_rating NUMERIC(2,1)
		)""")
		cursor.execute("""CREATE TABLE IF NOT EXISTS Air_conditioners (
				ID INT PRIMARY KEY,
				brand VARCHAR(30),
				model_number VARCHAR(120),
				family_name VARCHAR(50),
				cooling_usage_kw NUMERIC(10,5),
				heating_usage_kw NUMERIC(10,5),
				cooling_star_rating NUMERIC(10,5),
				heating_star_rating NUMERIC(10,5)
		)""")
		connection.commit()

def load_fridge_data():
	"""Loads refrigerator dataset"""
	fridges = pd.read_csv("refrigerators.csv")

	# Get only those sold in Australia and marked as Available
	# Eliminate those marked as "Cooled appliance" since these aren't really standard fridges or freezers
	fridge_is_available = (fridges["Availability Status"] == "Available")
	fridge_is_not_cooled_appliance = fridges.Designation != "Cooled appliance"
	fridge_is_sold_in_aus = fridges.Sold_in.map(lambda row: isinstance(row, str) and "Australia" in row)
	fridges = fridges[fridge_is_available & fridge_is_not_cooled_appliance & fridge_is_sold_in_aus].reset_index(drop = True)
	
	# Create new columns to mark whether each appliance is a fridge, freezer, or both
	fridges["is_refrigerator"] = fridges.Designation.map(lambda row: "Refrigerator" in row)
	fridges["is_freezer"] = fridges.Designation.map(lambda row: "Freezer" in row)
	fridges.drop(columns = ["Designation"], inplace = True)

	# Replace empty family names with empty strings
	fridges["Family Name"].fillna("", inplace = True)

	return fridges

def load_aircon_data():
	"""Loads air conditioners dataset"""
	aircons = pd.read_csv("air_conditioners.csv")
	
	# Get only those sold in Australia and marked as Available
	# Also select only aircons that have a star rating for cooling and heating
	# Also make sure they have heating & cooling -- some are cooling only
	aircon_is_available = aircons["Availability Status"] == "Available"
	aircon_is_sold_in_aus = aircons.Sold_in.map(lambda row: isinstance(row, str) and "Australia" in row)
	aircon_has_star_ratings = aircons.Star2010_Cool.notna() & aircons.Star2010_Heat.notna()
	aircon_heats_and_cools = aircons.Type == "Reverse Cycle"
	aircons = aircons[aircon_is_available & aircon_is_sold_in_aus & aircon_has_star_ratings & aircon_heats_and_cools].reset_index(drop = True)

	# Replace empty family names with empty strings
	aircons["Family Name"].fillna("", inplace = True)

	# There are two Mitsibushi Heavy Industries
	aircons.loc[aircons.Brand == "MITSUBISHI HEAVY INDUSTRIES, LTD.", "Brand"] = "MITSUBISHI HEAVY INDUSTRIES"

	return aircons

def load_data_into_db(connection: MySQLConnectionAbstract):
	fridges = load_fridge_data()
	aircons = load_aircon_data()
	
	with connection.cursor() as cursor:
		cursor.executemany(
			"INSERT INTO Refrigerators VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", [
			(index, row.Brand, row["Model No"], row["Family Name"], row.is_refrigerator, row.is_freezer, row.CEC_ / 12, int(row["Tot Vol"]), row.Star2009)
			for index, row in fridges.iterrows()
		])

		# "Rated cooling power input kW" column is identical to the "C-Power_Inp_Rated" column
		cursor.executemany(
			"INSERT INTO Air_conditioners VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", [
			(index, row.Brand, row.Model_No, row["Family Name"], row["Rated cooling power input kW"], row["Rated heating power input kW"], row.Star2010_Cool, row.Star2010_Heat)
			for index, row in aircons.iterrows()
		])

		connection.commit()

def main():
	with connect(host = "ta21-2023s2.mysql.database.azure.com", user = "TA21", password = getpass.getpass()) as connection:
		assert isinstance(connection, MySQLConnectionAbstract)
		print("Connected!")
		create_db_and_tables(connection)
		load_data_into_db(connection)
		print("Complete!")

main()