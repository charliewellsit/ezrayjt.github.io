import azure.functions as func
import mysql.connector, json, os

class DatabaseManager:
    def __init__(self, host, user, password, database):
        # Initialize a connection to the MySQL database
        self.connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        # Create a cursor object to interact with the database
        self.cursor = self.connection.cursor()

    def execute_query(self, query):
        # Execute the provided SQL query using the cursor
        self.cursor.execute(query)
        # Fetch the results of the query
        result = self.cursor.fetchall()
        return result

    def close(self):
        # Close the cursor and the database connection
        self.cursor.close()
        self.connection.close()

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Run a function that triggers every 5 minutes to prevent the function from going to sleep mode
# Runs only between 10pm to 5pm UTC which means in our timezone (AEST, UTC+10) it will be allowed to sleep from 3am to 8am
@app.schedule(schedule="0 */5 22-23,0-16 * * *", arg_name="timer")
def stayinalive(timer: func.TimerRequest):
    return

@app.route(route="get_data")
def get_data(req: func.HttpRequest):
    db_password = os.environ["mysql_database"]

    db_manager = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=db_password,
    database="energy"
    )

    # SQL query to get data from the database
    query = "SELECT region_name, financial_start_year + 1, ROUND(electricity_usage), ROUND(gas_usage), ROUND(non_renewable_electricity_total), ROUND(renewable_electricity_total), ROUND(total_electricity_generation), ROUND(total_gas_generation) FROM regions JOIN energy_consumption USING (region_id) JOIN energy_generation USING (region_id, financial_start_year)"

    # Execute the query using the DatabaseManager
    result = db_manager.execute_query(query)

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

    db_manager.close()
    result_json = json.dumps(data)
    
    return func.HttpResponse(
      result_json,
      mimetype="application/json"
    )