//get data from json file
let waste_data;
const waste_url='Front_end/json/waste.json';

async function getData(){
    const response = await fetch(waste_url);
    waste_data = await response.json();
  }

async function order(){
  await getData();
  getLocation();
};

order();







//initialise map
let myMap = L.map('wasteMap');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

myMap.setView([-37.8136, 144.9631], 9); 



//filter the data based on the option
// function filterData(userLocation, marker, marker2){
//   if (marker2){
//     marker2.remove();
//   }
//   let selectedCategory = document.getElementById("filter").value;
  
//   console.log(selectedCategory);
//   let selected = waste_data.filter(item => item.type === selectedCategory);

//   let selectedFasility = findNearestCoordinate(userLocation, selected);

//   marker2 = L.marker([selectedFasility.latitude, selectedFasility.longitude]).addTo(myMap);

//   let bounds = [marker.getLatLng(), marker2.getLatLng()];

// // Calculate padding factor (e.g., 0.1 for 10% padding)
// let paddingFactor = 0.2;

// // Calculate padding values
// let paddingLat = (bounds[1].lat - bounds[0].lat) * paddingFactor;
// let paddingLng = (bounds[1].lng - bounds[0].lng) * paddingFactor;

// // Apply padding to the bounds
// let paddedBounds = [
//   [bounds[0].lat - paddingLat, bounds[0].lng - paddingLng],
//   [bounds[1].lat + paddingLat, bounds[1].lng + paddingLng]
// ];

// // Fit the padded bounds to the map
// myMap.fitBounds(paddedBounds);

// };


//get user location and add markers
function getLocation() {

    let success = (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let marker = L.marker([lat, lng]).addTo(myMap);

        userLocation = {
          latitude: lat,
          longitude: lng,
        };

        let filtered = waste_data.filter((item) => {
          if (document.querySelector('h1').innerHTML === 'Building Waste')
          {return item.type === 'Disposal';}
          else if (document.querySelector('h1').innerHTML === 'Household Cleaners')
          {return item.type === 'Drop-Off';}
          else if (document.querySelector('h1').innerHTML === 'Lighting Containing Mercury')
          {return item.subtype === 'Organics Recycling Facility'}
          else if (document.querySelector('h1').innerHTML === 'Paint')
          {return item.subtype === 'Paper And Cardboard Recycling Facility'}
        })


        const nearestFasility = findNearestCoordinate(userLocation, filtered);

        // let circle = L.circle([nearestFasility.latitude, nearestFasility.longitude], {
        //   radius: 100,
        //   color: 'green',
        //   fillColor: 'green',
        //   fillOpacity: 0.7
        // }).addTo(myMap);

        let marker2 = L.marker([nearestFasility.latitude, nearestFasility.longitude]).addTo(myMap);

        marker.bindPopup("This is your location.").openPopup();

        marker2.bindPopup(`
        <p><strong>Name:</strong> ${nearestFasility.name}</p>
        <p><strong>Type:</strong> ${nearestFasility.type}</p>
        <p><strong>Sub-type:</strong> ${nearestFasility['sub-type']}</p>
        <p><strong>Owner:</strong> ${nearestFasility.owner}</p>
        <p><strong>State:</strong> ${nearestFasility.state}</p>
        <p><strong>Address:</strong> ${nearestFasility.address}, ${nearestFasility.suburb}, ${nearestFasility.postcode}</p>
        <hr>
    `);

        // set map view to show both marker and circle
        // Assuming marker and marker2 are Leaflet markers
let bounds = [marker.getLatLng(), marker2.getLatLng()];

// Calculate padding factor (e.g., 0.1 for 10% padding)
let paddingFactor = 0.2;

// Calculate padding values
let paddingLat = (bounds[1].lat - bounds[0].lat) * paddingFactor;
let paddingLng = (bounds[1].lng - bounds[0].lng) * paddingFactor;

// Apply padding to the bounds
let paddedBounds = [
  [bounds[0].lat - paddingLat, bounds[0].lng - paddingLng],
  [bounds[1].lat + paddingLat, bounds[1].lng + paddingLng]
];

// Fit the padded bounds to the map
myMap.fitBounds(paddedBounds);

// if (document.getElementById("filter").value!== 'all'){
//   filterData(marker, marker2);
// }


    }

    let error = () => {
        alert("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

getLocation();









// get nearest Fasility
function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  
  function findNearestCoordinate(currentLocation, coordinates) {
    let minDistance = Number.MAX_VALUE;
    let nearestCoordinate = null;

  
    for (const coordinate of coordinates) {

      const distance = getDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        coordinate.latitude,
        coordinate.longitude
      );

  
      if (distance < minDistance) {
        minDistance = distance;
        nearestCoordinate = coordinate;
      }
    }
  
    return nearestCoordinate;
  }
  

  // Example usage:
  const currentLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
  };
  
  const coordinateList = [
    { latitude: 37.7749, longitude: -122.4194 },
    { latitude: 34.0522, longitude: -118.2437 },
  ];
  
  // const nearestCoordinate = findNearestCoordinate(currentLocation, coordinateList);
  // console.log("Nearest Coordinate:", nearestCoordinate);
  