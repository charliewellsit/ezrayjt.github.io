let state_name;

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
  });
  });


async function getData(){
    
    const xs = [];
    const ys = [];

    const aus_url='../json/aus_data.json'
    const response = await fetch(aus_url);
    const aus_data = await response.json();

    const regionName = state_name;
    console.log(regionName);
    const regionData = aus_data.filter(entry => entry.region === regionName);

    const financialYears = regionData.map(entry => entry["financial year"]);
    xs.push(...financialYears);

    const electricityUsage = regionData.map(entry => entry["electricity_usage"]);
    ys.push(...electricityUsage);

    return {xs, ys};
}


// async function chartIt(){
//   const ausData = await getData();
//   const ctx = document.getElementById('chart1');

//   mychart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//       labels: ausData.xs,
//       datasets: [{
//       label: state_name,
//       data: ausData.ys,
//       borderWidth: 1
//       }]
//   },
//   options: {
//       scales: {
//       y: {
//           beginAtZero: true
//       }
//       }
//   }
//   });
// }

let data = {
  labels: [],
    datasets: [{
    label: state_name,
    data: [],
    borderWidth: 1
    }]
};

let config = {
  type: 'bar',
  data,
  options: {
      scales: {
      y: {
          beginAtZero: true
      }
      }
  }
};

const myChart= new Chart(
  document.getElementById('chart1'),
  config
);


async function updateChart(){
  const ausData = await getData();
  console.log(ausData);
  myChart.config.data.datasets[0].data = ausData.ys;
  myChart.config.data.labels = ausData.xs;
  myChart.update();
}
