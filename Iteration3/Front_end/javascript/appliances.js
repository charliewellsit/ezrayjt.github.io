async function FetchAppliancesAPI(){
    let selectedType = document.getElementById('appliance').value;

    if (selectedType === 'AC'){
        return fetchAcDataFromAPI();
    }
    else if (selectedType === 'Fridge'){
        return fetchFridgeDataFromAPI();
    }
}

// Function to fetch data from the API
async function fetchAcDataFromAPI() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_AC');
        // const response = await fetch('https://ta21-2023-s2.azurewebsites.net/api/get_AC')
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


// Function to fetch data from the API
async function fetchFridgeDataFromAPI() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_refrigerators');
        // const response = await fetch('https://ta21-2023-s2.azurewebsites.net/api/get_refrigerators')
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to fetch data from the API
async function fetchFridgeConsumptionFromAPI() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_fridge_avg_consumption');
        // const response = await fetch('https://ta21-2023-s2.azurewebsites.net/api/get_fridge_avg_consumption')
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to fetch data from the API
async function fetchFridgeHighestConsumptionFromAPI() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_fridge_highest_rating_consumption');
        // const response = await fetch('https://ta21-2023-s2.azurewebsites.net/api/get_fridge_highest_rating_consumption')
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Initialize Chart.js
const ctx = document.getElementById('energy-consumption-chart').getContext('2d');
let chart = null; // Declare the chart variable

// Function to update the graph based on user selections
async function updateGraph() {
    // Fetch data from the API
    const jsonData = await FetchAppliancesAPI(); // Await here to get the actual data

    console.log('jsonData:', jsonData);

    if (!Array.isArray(jsonData)) {
        // Handle the case where jsonData is not an array
        console.error('Invalid data:', jsonData);
        return;
    }
    
    // Function to initialize or update the chart
    function initializeOrUpdateChart(existingChart, ctx, data) {
        if (existingChart) {
            // If the chart exists, destroy it to clear any existing data
            existingChart.destroy();
        }

        const labels = data.map(item => item.star_rating.toString());
        const chartData = data.map(item => item.average_energy_consumption);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Average Energy Consumption per month',
                        data: chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Energy Consumption per month'
                        }
                    }
                }
            }
        });
    }

    // Fetch data from the API
    // const jsonData = await FetchAppliancesAPI();
    // const jsonData = await fetchFridgeDataFromAPI();

    // Get selected options
    const selectedType = document.getElementById('type').value;
    const selectedBrand = document.getElementById('brand').value;
    const selectedVolume = document.getElementById('volume').value;

    // Get selected star ratings
    const selectedStarRatings = Array.from(document.querySelectorAll('input[name="star-rating"]:checked')).map(checkbox => parseFloat(checkbox.value));

    // Sort the data by star rating and brand
    jsonData.sort((a, b) => {
        if (a.star_rating === b.star_rating) {
            return a.brand.localeCompare(b.brand);
        }
        return a.star_rating - b.star_rating;
    });

    // Filter the data based on selections
    const filteredData = jsonData.filter(item => 
        (!selectedType || item.type === selectedType) &&
        (!selectedBrand || item.brand === selectedBrand) &&
        (!selectedBrand || item.volume_category === selectedVolume) &&
        (selectedStarRatings.length === 0 || selectedStarRatings.includes(item.star_rating))
    );

    console.log('filteredData length:', filteredData.length);

    if (filteredData.length === 0) {
        // Display a message when there are no appliances based on the selection
        if (chart) {
            // If the chart exists, destroy it to clear any existing data
            chart.destroy();
        }
        document.getElementById('textRes').textContent = 'Nothing to show based on your selection';
        return;
    } else {
        // Initialize or update the chart
        chart = initializeOrUpdateChart(chart, ctx, filteredData);
        document.getElementById('textRes').textContent = '';
    }
}

// Function to remove event listeners
function removeEventListeners() {
    const typeElement = document.getElementById('type');
    const brandElement = document.getElementById('brand');
    const volumeElement = document.getElementById('volume');
    const starRatingCheckboxes = document.querySelectorAll('input[name="star-rating"]');

    typeElement.removeEventListener('change', updateGraph);
    brandElement.removeEventListener('change', updateGraph);
    volumeElement.removeEventListener('change', updateGraph);

    starRatingCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', updateGraph);
    });
}

// Function to add event listeners
function addEventListeners() {
    const typeElement = document.getElementById('type');
    const brandElement = document.getElementById('brand');
    const volumeElement = document.getElementById('volume');
    const starRatingCheckboxes = document.querySelectorAll('input[name="star-rating"]');

    typeElement.addEventListener('change', updateGraph);
    brandElement.addEventListener('change', updateGraph);
    volumeElement.addEventListener('change', updateGraph);

    starRatingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateGraph);
    });
}

// Initialize the graph with event listeners
addEventListeners();
updateGraph();

// ------------------ calculate section ------------------ 

function clearErrorMessages(){
    // Clear all error messages by setting their innerHTML to an empty string
    document.getElementById("errorMessageAllFields").innerHTML = "";
    document.getElementById("errorMessagePower").innerHTML = "";
    document.getElementById("errorMessageHours").innerHTML = "";
    document.getElementById("errorMessageCharge").innerHTML = "";
  }
  
  function displayErrorMessage(elementId, message) {
    // Display an error message in the specified element
    document.getElementById(elementId).innerHTML = message;
  }

function Calculate(){
    let conditionsMet = true;
  
    let power = parseFloat(document.getElementById("power").value);
    let hours = parseFloat(document.getElementById("hours").value);
    let charge = parseFloat(document.getElementById("charge").value);
  
    
    if (!power){
        displayErrorMessage("errorMessagePower", "Please enter the power consumption");
        conditionsMet = false;
    } else if (!hours){
        displayErrorMessage("errorMessageHours", "Please enter the hours of usage");
        conditionsMet = false;
    } else if (!charge){
        displayErrorMessage("errorMessageCharge", "Please provide the amount you are being billed by your energy provider.");
        conditionsMet = false;
    } else if (!power || !hours || !charge) {
        displayErrorMessage("errorMessageAllFields", "Please fill in all required fields before clicking 'Calculate'");
        conditionsMet = false;}
  
    if (conditionsMet){
      clearErrorMessages();
      let total = parseFloat((power * hours * charge / 100).toFixed(2));
  
      console.log(total);
  
      let resultText = "";

      resultText = `<br><br><span class="large-text">Your Result</span><br><br>
      <span class="med-text">Your total electricity cost per month would be $${total}.</span><br><br>`      
  
      const hiddenContainer = document.getElementById("hiddenContainer");
    //   hiddenContainer.style.backgroundImage = 'url("Front_end/images/bg_lights2.jpg")';
      hiddenContainer.style.backgroundColor = 'olive';
  
      const textField = document.getElementById("textField");
      textField.innerHTML = resultText;
  
      // Scroll to the "thisDiv" element
      const thisDiv = document.getElementById("thisDiv");
      thisDiv.scrollIntoView({ behavior: "smooth" });
  
      const showText2 = document.getElementById("text2");
      showText2.style.display = 'flex';
      
      compare(total);
    }
  }

function hideTable(){
    const tableContainer = document.getElementById("table-container");
    tableContainer.style.display = 'none';
}

async function showTable(){
    let appType = document.getElementById("app-type").value;
    let fridgeType = document.getElementById("fridgeType").value;

    const tableContainer = document.getElementById("table-container");
    const thisText = document.getElementById("thisText");

    const jsonData = await fetchFridgeConsumptionFromAPI();
    let filteredData = jsonData.filter(item => item.type === fridgeType); // Filter data based on fridgeType
    console.log(filteredData);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create an array of keys (column names) to be displayed in the table
    const keysToDisplay = Object.keys(filteredData[0]).filter(key => key !== "type");

    // Create table header without the "type" column
    const headerRow = document.createElement("tr");
    keysToDisplay.forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table body rows without the "type" column
    filteredData.forEach(item => {
        const bodyRow = document.createElement("tr");
        keysToDisplay.forEach(key => {
        const cell = document.createElement("td");
        cell.textContent = item[key];
        bodyRow.appendChild(cell);
        });
        tbody.appendChild(bodyRow);
    });

    // Append the header and body to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Append the table to the container
    tableContainer.innerHTML = ''; // Clear previous content
    thisText.innerHTML = `Use the table below to assist you!`;
    tableContainer.appendChild(thisText);
    tableContainer.appendChild(table);

    // show the table in the webpage
    tableContainer.style.display = 'grid';
    tableContainer.style.placeItems = 'center';

    thisText.style.display = 'block';

    table.style.borderCollapse = 'collapse';
    table.style.border = '2px solid black';

    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell) => {
        cell.style.border = '1px solid black'; // Add a black border to all cells
        cell.style.padding = '8px';
    });

    // Get all table rows
    const rows = document.querySelectorAll("tbody tr");

    // Add mouseover and mouseout event listeners to each row
    rows.forEach((row) => {
        row.addEventListener("mouseover", function () {
            // Add a CSS class to highlight the row on mouseover
            row.classList.add("highlighted-row");
        });

        row.addEventListener("mouseout", function () {
            // Remove the CSS class to remove the highlight on mouseout
            row.classList.remove("highlighted-row");
        });
    });
}

async function compare(result){

    const appType = document.getElementById("app-type").value;
    const fridgeType = document.getElementById("fridgeType").value;
    const hours = document.getElementById("hours").value;
    const charge = document.getElementById("charge").value;
    
    const jsonData = await fetchFridgeHighestConsumptionFromAPI();

    // Filter the JSON data based on the selected fridge type
    const filteredData = jsonData.filter(item => item.type === fridgeType);

    // Extract the energy consumption and star rating from the filtered data
    const energyConsumptionData = filteredData.map(item => item["Average Energy Consumption (kW)"]);
    const calcCost = energyConsumptionData * charge * hours / 100;
    console.log(`charge is ${calcCost}`);

    const savedMoney = document.getElementById('text3');
    const savings = (result - calcCost).toFixed(2);
    savedMoney.innerHTML = `You could've saved $${savings} per month by using the highest star rating appliance!`
    savedMoney.style.padding = '3rem';

    // Create labels for the x-axis
    const labels = ["You", "Highest Star Rating Appliance"];

    // Create a bar graph using Chart.js
    const ctx1 = document.getElementById("barChart").getContext("2d");

    // Destroy any existing chart on the canvas
    if (window.myBar) {
        window.myBar.destroy();
    }

    window.myBar = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cost per Month',
                    data: [result, calcCost],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Total Cost ($)"
                    }
                }
            }
        }
    });
}
