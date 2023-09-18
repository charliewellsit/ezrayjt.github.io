// Function to fetch data from the API
async function fetchDataFromAPI() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_incandescent');
        // const response = await fetch('https://ta21-2023-s2.azurewebsites.net/api/get_incandescents');
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        console.log(data); // Corrected console.log
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to filter and display data based on user selections
function filterAndDisplayData() {
    // Retrieve user selections
    const brand = document.getElementById('brand').value;
    const manufacturer_country = document.getElementById('manufacturer_country').value;
    const power = document.getElementById('power').value;

    // Fetch data from the API
    fetchDataFromAPI().then(data => {
        // Filter data based on user selections
        const filteredData = data.filter(item => {
            // Check the selected power condition
            let powerCondition = true;
            switch (power) {
                case 'below20':
                    powerCondition = item.power < 20;
                    break;
                case 'between20to30':
                    powerCondition = item.power >= 20 && item.power <= 30;
                    break;
                case 'above30':
                    powerCondition = item.power > 30;
                    break;
                case 'Any':
                    powerCondition = item.power;
            }
        
            // Check the brand condition
            const brandCondition = brand === 'Any' || item.brand === brand;

            // Check the brand condition
            const country = manufacturer_country === 'Any' || item.manufacturer_country === manufacturer_country;
    
            // Filter based on brand, power, country, and year conditions
            return brandCondition && powerCondition && country;
        });

        // Sort filteredData by efficiency in descending order
        filteredData.sort((a, b) => b.efficiency - a.efficiency);

        // Get the top 5 results
        const top5Results = filteredData.slice(0, 5);

        console.log(filteredData);
        

        // Get the table body
        const tbody = document.querySelector('#resultsTable tbody');

        // Clear previous results
        tbody.innerHTML = '';

        // Populate the table with filtered results
        top5Results.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <tr>
                <td>${item.brand}</td>
                <td>${item.model}</td>
                <td>${item.brightness}</td>
                <td>${item.power}</td>
                <td>${item.efficiency}</td>
                <td>${item.life}</td>
                <td><a href="https://www.google.com/search?q=${item.brand}+${item.model}+light bulb buy" target="_blank">Google</a>
                <a href="https://www.amazon.com/s?k=${encodeURIComponent('light bulb' + ' ' + item.brand + ' ' +item.model)}" target="_blank">Amazon</a></td>
            </tr>
            `;
            tbody.appendChild(row);
        });
    });

    // Scroll to the "thisDiv" element
    const thisDiv = document.getElementById("thisDiv");
    thisDiv.scrollIntoView({ behavior: "smooth" });

    // Show the hiddenDiv result (hiddenDiv is not shown before clicking the "Check" button)
    const hiddenDiv = document.getElementById("hiddenContainer");
    hiddenDiv.style.display = "block";
}

// Attach the filterAndDisplayData function to the Search button click event
document.getElementById('searchButton').addEventListener('click', filterAndDisplayData);