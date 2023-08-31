let state_name;

document.querySelectorAll(".paths").forEach((path) => {
  path.addEventListener("mouseover", function (e) {
    const divElement = document.getElementById("aus-map"); // Replace with your div's ID
    const rect = divElement.getBoundingClientRect();
    
    x = e.clientX - rect.left; // Calculate x relative to the div
    y = e.clientY - rect.top; // Calculate y relative to the div
    
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
    console.log(state_name);
    chartIt();
  });
  });


async function chartIt(){
    const ausData = await getData();
    const ctx = document.getElementById('chart1');
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ausData.xs,
        datasets: [{
        label: state_name,
        data: ausData.ys,
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
    });

  }

async function getData(){
    
    const xs = [];
    const ys = [];

    const aus_url='../json/aus_data.json'
    const response = await fetch(aus_url);
    const aus_data = await response.json();

    const regionName = state_name; // Replace with the region name you want to plot
    const regionData = aus_data.filter(entry => entry.region === regionName);

    const financialYears = regionData.map(entry => entry["financial year"]);
    xs.push(...financialYears);

    const electricityUsage = regionData.map(entry => entry["electricity_usage"]);
    ys.push(...electricityUsage);

    return {xs, ys};
}


