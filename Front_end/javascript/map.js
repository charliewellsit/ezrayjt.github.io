let state_name;
let aus_data;

async function init(){
  const aus_url='https://ta21-2023-s2.azurewebsites.net/api/get_data'
  const response = await fetch(aus_url);
  aus_data = await response.json();
}

init();

document.querySelectorAll(".paths").forEach((path) => {
  path.addEventListener("mouseover", function (e) {
    const divElement = document.getElementById("aus-map");
    const rect = divElement.getBoundingClientRect();
    
    x = e.clientX - rect.left; // Calculate x relative to the div
    y = e.clientY - rect.top;
    
    document.getElementById("map-tip").style.top = y - 120 + "px";
    document.getElementById("map-tip").style.left = x - 120 + "px";

    document.getElementById("state-name").innerHTML = path.id;
    document.getElementById("map-tip").style.opacity = 0.7;
  });

  path.addEventListener("mouseleave", function () {
    document.getElementById("map-tip").style.opacity = 0;
  });

  path.addEventListener("click", function () {
    state_name = path.id;
    updateChart();
    document.getElementById("suggestion").style.opacity = 0;
  });
  });


async function getData(){
    
    const xs = [];
    const ys = [];
    const pieData = [];

    const regionName = state_name;
    console.log(regionName);
    const regionData = aus_data.filter(entry => entry.region === regionName);

    const financialYears = regionData.map(entry => entry["financial year"]);
    xs.push(...financialYears);

    const electricityGenerated = regionData.map(entry => entry["total_electricity_generated"]);
    pieData.push(...electricityGenerated);

    const electricityUsage = regionData.map(entry => entry["electricity_usage"]);
    ys.push(...electricityUsage);

    return {xs, ys, pieData};
}


const ctx = document.getElementById('chart1');

const myChart = new Chart(ctx, {
type: 'line',
data: {
    labels: [],
    datasets: [{
    label: 'Electricity Consumption',
    data: [],
    fill: false,
    bordercolor: 'rgb(255, 99, 132)',
    tension: 0.1
    }]
},
options: {
    scales: {
    y: {
        beginAtZero: false,
        ticks: {
          callback: function(value, index, values) {
            return value + ' MWh';
          }
        }
    }
    }
}
});


const ctx2 = document.getElementById('chart2');

const myChart2 = new Chart(ctx2, {
type: 'doughnut',
data :{
  labels: [
    'Electricity Consumption',
    'Electricity Generated'
  ],
  datasets: [{
    label: '',
    data: [],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)'
    ],
    hoverOffset: 4
  }]
}
});

// let data = {
//   labels: [],
//     datasets: [{
//     label: state_name,
//     data: [],
//     borderWidth: 1
//     }]
// };

// let config = {
//   type: 'bar',
//   data,
//   options: {
//       scales: {
//       y: {
//           beginAtZero: true
//       }
//       }
//   }
// };

// const myChart= new Chart(
//   document.getElementById('chart1'),
//   config
// );


async function updateChart(){
  const ausData = await getData();
  console.log(ausData);
  myChart.config.data.datasets[0].data = ausData.ys;
  myChart.config.data.labels = ausData.xs;
  myChart.update();

  myChart2.config.data.datasets[0].data = [ausData.pieData[ausData.pieData.length - 1], ausData.ys[ausData.ys.length - 1]];
  console.log(ausData.pieData[ausData.pieData.length - 1], ausData.ys[ausData.ys.length - 1]);
  myChart2.update();
}
