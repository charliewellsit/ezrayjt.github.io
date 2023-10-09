# api_handler.py
import getpass
from flask import Flask, jsonify
from database_manager import DatabaseManager
# from flask_cors import CORS
import json

# Create a Flask app instance
app = Flask(__name__)
# CORS(app)

db_manager_energy = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=getpass.getpass(),
    database="energy"
)

# Route to get data for iteration 1 map feature
@app.route('/api/get_data', methods=['GET'])
def get_data():
    # SQL query to get data from the database
    query = "SELECT region_name, financial_start_year + 1, ROUND(electricity_usage) / 1000, ROUND(gas_usage), ROUND(non_renewable_electricity_total) / 1000, ROUND(renewable_electricity_total) / 1000, ROUND(total_electricity_generation) / 1000, ROUND(total_gas_generation) FROM regions JOIN energy_consumption USING (region_id) JOIN energy_generation USING (region_id, financial_start_year)"

    # Execute the query using the DatabaseManager
    result = db_manager_energy.execute_query(query)

    # Process the query result and format it as JSON
    data = [{
            'region': region,
            'financial year': year,
            'electricity_usage': electricity_usage,
            'gas_usage': gas_usage,
            'non_renewable_source_electricity_generated': elect_non_renewable_generated,
            'renewable_source_electricity_generated': elect_renewable_generated,
            'total_electricity_generated': total_elect_generated,
            'total_gas_generated': total_gas_generated
        } for region, year, electricity_usage, gas_usage, elect_non_renewable_generated, elect_renewable_generated, total_elect_generated, total_gas_generated in result]

    db_manager_energy.close()
    result_json = json.dumps(data)
    return result_json

if __name__ == '__main__':
    app.run()