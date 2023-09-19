const wastemap = L.map('wasteMap'); 
// Initializes map

wastemap.setView([-37.8136, 144.9631], 9); 
// Sets initial coordinates and zoom level

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(wastemap); 
// Sets map data source and associates with map

do {
    latOffset = (Math.random() * 0.22) - 0.11;
    lngOffset = (Math.random() * 0.22) - 0.11; 
  } while (Math.abs(latOffset) >= 0.4 || Math.abs(lngOffset) >= 0.4);

let marker, circle, zoomed;

navigator.geolocation.watchPosition(success, error);

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    // Removes any existing marker and circule (new ones about to be set)

    marker = L.marker([lat, lng]).addTo(wastemap);
    circle = L.circle([lat+latOffset, lng+lngOffset], { radius: accuracy*100 }).addTo(wastemap);
    // Adds marker to the map and a circle for accuracy


    if (!zoomed) {
        zoomed = wastemap.fitBounds(circle.getBounds()); 
    }
    // Set zoom to boundaries of accuracy circle

    wastemap.setView([lat, lng], 10);
    // Set map focus to current user position

}

function error(err) {

    if (err.code === 1) {
        alert("Please allow geolocation access");
    } else {
        alert("Cannot get current location");
    }

}