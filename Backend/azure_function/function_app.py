import azure.functions as func
from azure.identity import ManagedIdentityCredential
from azure.keyvault.secrets import SecretClient
import mysql.connector, json

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

@app.route(route="get_data")
def get_data(req: func.HttpRequest) -> func.HttpResponse:
    # Key Vault URL
    KEY_VAULT_URL = "https://ta21-fit5120.vault.azure.net/"

    # Initialize the managed identity credentials
    credential = ManagedIdentityCredential()
    # Initialize the Secret Client
    secret_client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)

    # Get the connection string from Azure Key Vault
    db_secret = secret_client.get_secret("mysql-database")
    db_password = db_secret.value

    db_manager = DatabaseManager(
    host="ta21-2023s2.mysql.database.azure.com",
    user="TA21",
    password=db_password,
    database="energy"
    )

    # SQL query to get data from the database
    query = "SELECT r.region_name, c.financial_start_year + 1, ROUND(c.electricity_usage), ROUND(c.gas_usage), ROUND(g.non_renewable_electricity_total), ROUND(g.renewable_electricity_total), ROUND(g.total_electricity_generation), ROUND(g.total_gas_generation) FROM regions r LEFT JOIN energy_consumption c ON r.region_id = c.region_id RIGHT JOIN energy_generation g ON r.region_id = g.region_id AND c.financial_start_year = g.financial_start_year"

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