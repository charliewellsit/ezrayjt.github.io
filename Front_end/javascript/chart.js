// chartIt();

// async function chartIt(){
//     const ausData = await getData();
//     console.log(ausData);
//     const ctx = document.getElementById('chart1');
//     new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ausData.xs,
//         datasets: [{
//         label: 'electricity',
//         data: ausData.ys,
//         borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//         y: {
//             beginAtZero: true
//         }
//         }
//     }
//     });}

// async function getData(){
    
//     const xs = [];
//     const ys = [];

//     const aus_url='../json/aus_data.json'
//     const response = await fetch(aus_url);
//     const aus_data = await response.json();

//     const regionName = state_name; // Replace with the region name you want to plot
//     const regionData = aus_data.filter(entry => entry.region === regionName);

//     const financialYears = regionData.map(entry => entry["financial year"]);
//     console.log(financialYears); // Array of all financial years
//     xs.push(...financialYears);
//     console.log(xs);

//     return {xs, ys};
// }


// const ctx2 = document.getElementById('chart2');