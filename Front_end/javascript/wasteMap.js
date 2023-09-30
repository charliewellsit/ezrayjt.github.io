//get data from json file
let waste_data;
const waste_url='Front_end/json/waste.json';

async function getData(){
    const response = await fetch(waste_url);
    waste_data = await response.json();
  }

getData();







//initialise map
let myMap = L.map('wasteMap');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

myMap.setView([-37.8136, 144.9631], 9); 






//get user location and add markers
function getLocation() {

    let success = (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let marker = L.marker([lat, lng]).addTo(myMap);

        let userLocation = {
          latitude: lat,
          longitude: lng,
        };
        const nearestFasility = findNearestCoordinate(userLocation, waste_data);

        let circle = L.circle([nearestFasility.latitude, nearestFasility.longitude], {
          radius: 100,
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.7
        }).addTo(myMap);

        marker.bindPopup("This is your location.").openPopup();

        circle.bindPopup(`
        <p><strong>Name:</strong> ${nearestFasility.name}</p>
        <p><strong>Type:</strong> ${nearestFasility.type}</p>
        <p><strong>Sub-type:</strong> ${nearestFasility['sub-type']}</p>
        <p><strong>Owner:</strong> ${nearestFasility.owner}</p>
        <p><strong>State:</strong> ${nearestFasility.state}</p>
        <p><strong>Address:</strong> ${nearestFasility.address}, ${nearestFasility.suburb}, ${nearestFasility.postcode}</p>
        <hr>
    `);

        // set map view to show both marker and circle
        let bounds = [marker.getLatLng(), circle.getBounds().getNorthEast(), circle.getBounds().getSouthWest()];
        myMap.fitBounds(bounds);
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
    // console.log("lat1:", lat1, "lon1:", lon1, "lat2:", lat2, "lon2:", lon2);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    // console.log("Distance:", distance);
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
  