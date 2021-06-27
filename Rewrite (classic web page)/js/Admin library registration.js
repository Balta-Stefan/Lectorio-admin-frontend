disableCanvasEvents = false;

canvas_setup();
canvas_draw_lines();

var submit_registration_form_button = document.getElementById("library_registration_submit_button");
submit_registration_form_button.onclick = submit_reading_room_registration_data;

latitude = null;
longitude = null;


var mymap = L.map('map').setView([44.779666, 17.202873], 13);

var map_pin = L.icon({
    iconUrl: 'Resources/map pin.png',
    iconSize:     [24, 36], // size of the icon
    iconAnchor:   [12, 36], // point of the icon which will correspond to marker's location
});

var marker = null;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox/streets-v11', //satellite-v9
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);
	

	
var popup = L.popup();

function onMapClick(e) {
	if(marker != null)
		mymap.removeLayer(marker);
	
	latitude = e.latlng.lat;
	longitude = e.latlng.lng
	marker = L.marker([latitude, longitude], {icon: map_pin}).addTo(mymap);
	

}
disableCanvasEvents = false;
mymap.on('click', onMapClick);