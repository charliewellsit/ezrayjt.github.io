# api_handler.py
import getpass
from flask import Flask, jsonify
from database_manager import DatabaseManager
from flask_cors import CORS
import json

# Create a Flask app instance
app = Flask(__name__)
CORS(app)

db_manager_iteration3 = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=getpass.getpass(),
    database="iteration3"
)

# Route to get refrigerators data for iteration 2
@app.route('/api/get_refrigerators', methods=['GET'])
def get_data_refrigerators():
    # SQL query to get data from the database
    query = "SELECT brand, model_number, is_refrigerator, is_freezer, energy_usage_kwh_per_month, total_volume_litres, star_rating FROM Refrigerators"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        model_number = each[1]
        is_refrigerator = each[2]
        is_freezer = each[3]
        energy_usage_kwh_per_month = float(each[4])
        total_volume_litres = each[5]
        star_rating = float(each[6])

        data.append({
            'brand': brand,
            'model': model_number,
            'is_refrigerator': is_refrigerator,
            'is_freezer': is_freezer,
            'energy_usage_kwh_per_month' : energy_usage_kwh_per_month,
            'total_volume_litres': total_volume_litres,
            'star_rating': star_rating
        })

    result_json = json.dumps(data)
    return result_json

# Route to get air conditioners data for iteration 2
@app.route('/api/get_ac', methods=['GET'])
def get_data_ac():
    # SQL query to get data from the database
    query = "SELECT brand, model_number, cooling_usage_kw, heating_usage_kw, ROUND(cooling_star_rating,1), ROUND(heating_star_rating,1) FROM air_conditioners"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        model_number = each[1]
        cooling_usage_kw = float(each[2])
        heating_usage_kw = float(each[3])
        cooling_star_rating = float(each[4])
        heating_star_rating = float(each[5])

        data.append({
            'brand': brand,
            'model': model_number,
            'cooling_usage_kw': cooling_usage_kw,
            'heating_usage_kw': heating_usage_kw,
            'cooling_star_rating': cooling_star_rating,
            'heating_star_rating': heating_star_rating
        })

    # # Process the query result and format it as JSON
    # data = [{
    #         'brand': brand,
    #         'model': model_number,
    #         'cooling_usage_kw': cooling_usage_kw,
    #         'heating_usage_kw': heating_usage_kw,
    #         'cooling_star_rating': cooling_star_rating,
    #         'heating_star_rating': heating_star_rating
    #     } for brand, model_number, cooling_usage_kw, heating_usage_kw, cooling_star_rating, heating_star_rating in result]

    result_json = json.dumps(data)
    return result_json

if __name__ == '__main__':
    app.run()