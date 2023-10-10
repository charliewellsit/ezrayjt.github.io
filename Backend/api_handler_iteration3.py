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


# ---------------------------------------------------- fridge data


# Route to get refrigerators data for iteration 3
@app.route('/api/get_refrigerators', methods=['GET'])
def get_data_refrigerators():
    # SQL query to get data from the database
    # query = "SELECT brand, model_number, is_refrigerator, is_freezer, energy_usage_kwh_per_month, total_volume_litres, star_rating, CASE WHEN total_volume_litres <= 200 THEN 'Small' WHEN total_volume_litres <= 350 THEN 'Medium' WHEN total_volume_litres <= 500 THEN 'Large' ELSE 'Extra Large' END AS volume_category FROM Refrigerators"
    query = "SELECT brand, CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END AS 'type', ROUND(AVG(energy_usage_kwh_per_month), 3) AS average_energy_consumption, star_rating, CASE WHEN total_volume_litres <= 200 THEN 'Small' WHEN total_volume_litres <= 350 THEN 'Medium' WHEN total_volume_litres <= 500 THEN 'Large' ELSE 'Extra Large' END AS volume_category FROM Refrigerators GROUP BY brand, type, volume_category, star_rating ORDER BY count(*) DESC, brand, type, star_rating, volume_category"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        type = each[1]
        average_energy_consumption = float(each[2])
        star_rating = float(each[3])
        volume_category = each[4].title()

        data.append({
            'brand': brand,
            'type': type,
            'average_energy_consumption' : average_energy_consumption,
            'star_rating': star_rating,
            'volume_category': volume_category
        })

    result_json = json.dumps(data)
    return result_json

# Route to get refrigerators data for iteration 3
@app.route('/api/get_fridge_avg_consumption', methods=['GET'])
def get_data_fridge_avg_consumption():
    # SQL query to get data from the database

    # with volume category
    # query = "SELECT CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END AS 'type', ROUND(AVG(energy_usage_kwh_per_month), 3) AS average_energy_consumption, star_rating, CASE WHEN total_volume_litres <= 200 THEN 'Small' WHEN total_volume_litres <= 350 THEN 'Medium' WHEN total_volume_litres <= 500 THEN 'Large' ELSE 'Extra Large' END AS volume_category FROM Refrigerators GROUP BY type, volume_category, star_rating ORDER BY type, star_rating, volume_category"

    # with type
    query = "SELECT CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END AS 'type', ROUND(AVG(energy_usage_kwh_per_month), 3) AS average_energy_consumption, star_rating FROM Refrigerators GROUP BY type, star_rating ORDER BY type, star_rating"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        type = each[0].title()
        average_energy_consumption = float(each[1])
        star_rating = float(each[2])

        data.append({
            'type': type,
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

# Route to get refrigerators data for iteration 3
@app.route('/api/get_fridge_highest_rating_consumption', methods=['GET'])
def get_fridge_highest_rating_consumption():
    # SQL query to get data from the database

    query = "WITH RankedRefrigerators AS (SELECT CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END AS 'type', ROUND(AVG(energy_usage_kwh_per_month), 3) AS average_energy_consumption, star_rating, ROW_NUMBER() OVER (PARTITION BY CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END ORDER BY star_rating DESC) AS RowNum FROM Refrigerators GROUP BY CASE WHEN is_refrigerator = 1 AND is_freezer = 1 THEN 'Fridge&Freezer' WHEN is_refrigerator = 1 AND is_freezer = 0 THEN 'Fridge' ELSE 'Freezer' END, star_rating) SELECT type, average_energy_consumption, star_rating FROM RankedRefrigerators WHERE RowNum = 1 ORDER BY type"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        type = each[0].title()
        average_energy_consumption = float(each[1])
        star_rating = float(each[2])

        data.append({
            'type': type,
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

# ---------------------------------------------------- air conditioners data

# Route to get air conditioners data for iteration 3
@app.route('/api/get_ac_cooling', methods=['GET'])
def get_ac_cooling():
    # SQL query to get data from the database
    # query = "SELECT brand, model_number, cooling_usage_kw, heating_usage_kw, ROUND(cooling_star_rating,1), ROUND(heating_star_rating,1) FROM air_conditioners"
    query = "SELECT brand, ROUND(AVG(cooling_usage_kw),3)*30, ROUND(cooling_star_rating,1) FROM air_conditioners GROUP BY brand, cooling_star_rating"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        average_energy_consumption = float(each[1])
        star_rating = float(each[2])

        data.append({
            'brand': brand,
            'average_energy_consumption':average_energy_consumption,
            'star_rating': star_rating
        })

    result_json = json.dumps(data)
    return result_json

# Route to get air conditioners data for iteration 3
@app.route('/api/get_ac_heating', methods=['GET'])
def get_ac_heating():
    # SQL query to get data from the database
    query = "SELECT brand, ROUND(AVG(heating_usage_kw),3), ROUND(heating_star_rating,1) FROM air_conditioners GROUP BY brand, heating_star_rating"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        brand = each[0].title()
        average_energy_consumption = float(each[1])
        star_rating = float(each[2])

        data.append({
            'brand': brand,
            'average_energy_consumption': average_energy_consumption,
            'star_rating': star_rating
        })

    result_json = json.dumps(data)
    return result_json

# Route to get ac data for iteration 3
@app.route('/api/get_ac_cooling_avg_consumption', methods=['GET'])
def get_ac_cooling_avg_consumption():
    # SQL query to get data from the database

    query = "SELECT ROUND(AVG(cooling_usage_kw), 3) AS average_energy_consumption, ROUND(cooling_star_rating,1) AS cooling_star_rating FROM air_conditioners GROUP BY cooling_star_rating ORDER BY cooling_star_rating"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        average_energy_consumption = float(each[0])
        star_rating = float(each[1])

        data.append({
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

# Route to get ac data for iteration 3
@app.route('/api/get_ac_heating_avg_consumption', methods=['GET'])
def get_ac_heating_avg_consumption():
    # SQL query to get data from the database

    query = "SELECT ROUND(AVG(heating_usage_kw), 3) AS average_energy_consumption, ROUND(heating_star_rating,1) AS heating_star_rating FROM air_conditioners GROUP BY heating_star_rating ORDER BY heating_star_rating"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        average_energy_consumption = float(each[0])
        star_rating = float(each[1])

        data.append({
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

# Route to get ac data for iteration 3
@app.route('/api/get_ac_heating_highest_rating_consumption', methods=['GET'])
def get_ac_heating_highest_rating_consumption():
    # SQL query to get data from the database

    query = "SELECT ROUND(AVG(heating_usage_kw), 3) AS average_energy_consumption, ROUND(heating_star_rating,1) AS heating_star_rating FROM air_conditioners GROUP BY heating_star_rating ORDER BY heating_star_rating DESC LIMIT 1"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        average_energy_consumption = float(each[0])
        star_rating = float(each[1])

        data.append({
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

# Route to get ac data for iteration 3
@app.route('/api/get_ac_cooling_highest_rating_consumption', methods=['GET'])
def get_ac_cooling_highest_rating_consumption():
    # SQL query to get data from the database

    query = "SELECT ROUND(AVG(cooling_usage_kw), 3) AS average_energy_consumption, ROUND(cooling_star_rating,1) AS cooling_star_rating FROM air_conditioners GROUP BY cooling_star_rating ORDER BY cooling_star_rating DESC LIMIT 1"

    # Execute the query using the DatabaseManager
    result = db_manager_iteration3.execute_query(query)

    # Process the query result and format it as JSON
    data = []
    for each in result:
        average_energy_consumption = float(each[0])
        star_rating = float(each[1])

        data.append({
            'Star Rating': star_rating,
            'Average Energy Consumption (kW)' : average_energy_consumption,
        })

    result_json = json.dumps(data)
    return result_json

if __name__ == '__main__':
    app.run()