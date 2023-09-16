# api_handler.py
import getpass
from flask import Flask, jsonify
from database_manager import DatabaseManager
# from flask_cors import CORS
import json

# Create a Flask app instance
app = Flask(__name__)
# CORS(app)

db_manager_iteration2 = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=getpass.getpass(),
    database="iteration2"
)

# Route to get incandescent light bulb data for iteration 2
@app.route('/api/get_incandescent', methods=['GET'])
def get_data_incandescent():
    # SQL query to get data from the database
    query = "SELECT i.brand, i.model_number, i.lamp_power_watts, i.lamp_light_lumens, i.lamp_life_hours, GROUP_CONCAT(m.manufacturer_country) AS country_list FROM incandescents i JOIN incandescent_manufacturing m ON i.ID = m.incandescent_ID GROUP BY i.brand, i.model_number, i.lamp_power_Watts, i.lamp_light_lumens, i.lamp_life_hours"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration2.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        model_number = each[1]
        lamp_power_watts = each[2]
        lamp_light_lumens = round(each[3])
        lamp_life_hours = each[4]
        country_list = each[5]
        efficiency = round(lamp_light_lumens/lamp_power_watts)

        data.append({
            'brand': brand,
            'model': model_number,
            'power': lamp_power_watts,
            'brightness': lamp_light_lumens,
            'life': lamp_life_hours,
            'manufacturer_country': country_list,
            # no unit for efficiency so can sort based on the efficiency for the frontend
            'efficiency': efficiency
        })

    result_json = json.dumps(data)
    return result_json

# Route to get CFL data for iteration 2
@app.route('/api/get_CFL', methods=['GET'])
def get_data_CFL():
    # SQL query to get data from the database
    query = "SELECT c.brand, c.model_number, c.manufacturer_country, c.lamp_power_watts, c.lamp_light_lumens, c.colour_temperature, c.lamp_life_hours FROM CFLs c"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration2.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        model_number = each[1]
        manufacturer_country = each[2]
        lamp_power_watts = each[3]
        lamp_light_lumens = round(each[4])
        colour_temperature = each[5]
        lamp_life_hours = each[6]
        
        efficiency = round(lamp_light_lumens/lamp_power_watts)

        data.append({
            'brand': brand,
            'model': model_number,
            'power': lamp_power_watts,
            'brightness': lamp_light_lumens,
            'life': lamp_life_hours,
            'manufacturer_country': manufacturer_country,
            'colour_temperature': colour_temperature,
            # no unit for efficiency so can sort based on the efficiency for the frontend
            'efficiency': efficiency
        })

    result_json = json.dumps(data)
    return result_json

# Route to get waste management facilities data for iteration 2
@app.route('/api/get_waste_mgmt_facilities', methods=['GET'])
def get_data_waste_facilities():
    # SQL query to get data from the database
    query = "SELECT w.x, w.y, w.facility_management_type, w.facility_infrastructure_type, w.facility_owner, w.facility_name, w.state_or_territory, w.address, w.suburb, w.postcode FROM waste_management_facilities w"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration2.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        x = each[0]
        y = each[1]
        facility_management_type = each[2].title()
        facility_infrastructure_type = each[3].title()
        facility_owner = each[4].title()
        facility_name = each[5].title()
        state_or_territory = each[6]
        address = each[7].title()
        suburb = each[8].title()
        postcode = each[9]

        data.append({
            'x-coordinate': x,
            'y-coordinate': y,
            'type': facility_management_type,
            'sub-type': facility_infrastructure_type,
            'owner': facility_owner,
            'name': facility_name,
            'state': state_or_territory,
            'address': address,
            'suburb': suburb,
            'postcode': postcode
        })

    result_json = json.dumps(data)
    return result_json


if __name__ == '__main__':
    app.run()