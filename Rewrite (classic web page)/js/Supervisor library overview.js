async function supervisor_pregled_citaonica_click()
{
	// globalTempVariable holds all the reading rooms (as JSON array)
	// globalTempVariable2 holds the selected reading room
	
	canvas_setup();
	canvas_draw_lines();
	
	var URL1 = URLprefix + "reading-rooms";
	globalTempVariable = await make_request(URL1, "GET", JSON_headers, null);
	if(!globalTempVariable.ok)
	{
		alert("Greška");
		return;
	}
	globalTempVariable = await globalTempVariable.json();
	
	console.log(globalTempVariable);
	
	// populate the reading room select
	var selectElement = document.getElementById("admin_list_of_libraries");
	
	for(var i = 0; i < globalTempVariable.length; i++)
		selectElement.innerHTML += '<option value="' + globalTempVariable[i].id + '">' + "ID čitaonice: " + globalTempVariable[i].id + ", Ime: " + globalTempVariable[i].name + '</option>';
		
	selectElement.addEventListener("change", async function(event)
	{
		var selectedReadingroomID = event.target.value;
		globalTempVariable2 = globalTempVariable.find(toFind => toFind.id == selectedReadingroomID);
		console.log(globalTempVariable2);
		// populate the input elements
		//var latitude_input = document.getElementById("latitude_input");
		//var longitude_input = document.getElementById("longitude_input");
		var address_input = document.getElementById("address_input");
		var name_input = document.getElementById("name_input");
		var thumbnail_input = document.getElementById("thumbnail_input");
		var other_images_input = document.getElementById("other_images_input");
		var number_of_seats_input = document.getElementById("number_of_seats_input");
		var reading_room_type = document.getElementById("type_of_reading_room");
		var activation_status_input = document.getElementById("activation_status_input");
		
		
		var reading_room_thumbnail = document.getElementById("admin_library_picture");
		reading_room_thumbnail.src = globalTempVariable2.readingRoomListImage;
		
		reading_room_type.value = globalTempVariable2.readingRoomType;
		//latitude_input.value = globalTempVariable2.latitude;
		//longitude_input.value = globalTempVariable2.longitude;
		address_input.value = globalTempVariable2.address;
		name_input.value = globalTempVariable2.name;
		thumbnail_input.value = globalTempVariable2.readingRoomListImage;
		other_images_input.value = globalTempVariable2.images;
		number_of_seats_input.value = globalTempVariable2.numberOfSeats;
		activation_status_input.value = globalTempVariable2.active === true ? 'Aktivna' : 'Neaktivna';
		
		mymap.setView([globalTempVariable2.latitude, globalTempVariable2.longitude], 13);
		add_marker_to_map(globalTempVariable2.latitude, globalTempVariable2.longitude);
		
		// populate the administrators list
		//var addressInput = document.getElementById("admin_library_address");
		var URL = URLprefix + "reading-rooms/" + globalTempVariable2.id + "/administrators";
		console.log(URL);
		var listOfAdminsRequest = await make_request(URL, "GET", JSON_headers, null);
		var listOfAdmins = await listOfAdminsRequest.json();
		console.log(listOfAdmins);
		var adminsSelect = document.getElementById("admin_library_administrators");
		
		adminsSelect.innerHTML = "";
		adminsSelect.innerHTML += '<option selected style="display:none;">Administratori čitaonice</option>';
		for(var i = 0; i < listOfAdmins.length; i++)
		{
			adminsSelect.innerHTML += "<option>" + "ID: " + listOfAdmins[i].id + ", Ime: " + listOfAdmins[i].username + "</option>"
		}
		//addressInput.value = globalTempVariable2.address;
		
		
		// draw the library layout
		drawLibrary(canvas_context, globalTempVariable2.ySize, globalTempVariable2.xSize, globalTempVariable2.insideAppearance);

	}); 
	
	async function handle_request(activate)
	{
		var URL = URLprefix + "reading-rooms/" + globalTempVariable2.id;
		globalTempVariable2.active = activate;
		var request_status = await make_request(URL, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
		if(!request_status.ok)
		{
			alert("Greška");
			return;
		}
		activation_status_input.value = globalTempVariable2.active === true ? 'Aktivna' : 'Neaktivna';
		alert("Operacija uspješna");
	}
	
	var deactivateButton = document.getElementById("admin_deactivate_library_btn");
	deactivateButton.addEventListener("click", async function()
	{
		handle_request(false);
	});
	
	var activateButton = document.getElementById("admin_activate_library_btn");
	activateButton.addEventListener("click", async function()
	{
		handle_request(true);
	});
}
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

function add_marker_to_map(latitude, longitude)
{
	if(marker != null)
		mymap.removeLayer(marker);
	
	marker = L.marker([latitude, longitude], {icon: map_pin}).addTo(mymap);
}
disableCanvasEvents = true;

supervisor_pregled_citaonica_click();