// Function to fetch data from the API
async function fetchDataFromAPI() {
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

// Initialize Chart.js
const ctx = document.getElementById('energy-consumption-chart').getContext('2d');
let chart = null; // Declare the chart variable

// Function to update the graph based on user selections
async function updateGraph() {
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
                        label: 'Average Energy Consumption',
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
                            text: 'Average Energy Consumption'
                        }
                    }
                }
            }
        });
    }

    // Fetch data from the API
    const jsonData = await fetchDataFromAPI();

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
