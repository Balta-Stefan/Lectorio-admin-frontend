async function library_activations_panel_activation()
{	
	// globalTempVariable1 holds the selected reading room
	// globalTempVariable2 holds the selected request
	
	globalTempVariable1 = null;
	
	canvas_setup();
	canvas_draw_lines();
	
	// get all requests
	//make_request(URL, method, headers, body_content)
	var URL1 = URLprefix + "requests";
	const answer = await make_request(URL1, "GET", JSON_headers, null);
	const answer_JSON = await answer.json();
	globalTempVariable = answer_JSON;
	
	// populate the select element
	var selectElement = document.getElementById("libraries_to_activate_select");
	for(var i = 0; i < answer_JSON.length; i++)
	{
		if(answer_JSON[i].readingRoomId == null) // skip reading room requests
			continue
		selectElement.innerHTML = selectElement.innerHTML + '<option value="' + answer_JSON[i].id + '">' + "ID zahtjeva: " + answer_JSON[i].id + '</option>';
	}
	
	var libraryNameInput = document.getElementById("activation_library_name");
	var requestSenderInput = document.getElementById("activation_library_request_sender");
	var library_address = document.getElementById("library_address");
	var reading_room_type = document.getElementById("reading_room_type");
	var reading_room_images_input = document.getElementById("reading_room_images_input");
	var reading_room_thumbnail = document.getElementById("reading_room_thumbnail");
	
	selectElement.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		var selectedRequest = globalTempVariable.find(toFind => toFind.id == selectedID);
		globalTempVariable2 = selectedRequest;
		
		const URL2 = URLprefix + "reading-rooms/" + selectedRequest.readingRoomId;
		const response = await make_request(URL2, "GET", JSON_headers, null);
		const json_response = await response.json();
		globalTempVariable1 = json_response;
		
		if(!response.ok)
			return;
		// populate admin data
		libraryNameInput.value = json_response.name;
		library_address.value = json_response.address;
		reading_room_type.value = json_response.readingRoomType;
		reading_room_images_input.value = json_response.images;
		reading_room_thumbnail.src = json_response.readingRoomListImage;
		
		mymap.setView([json_response.latitude, json_response.longitude], 13);
		add_marker_to_map(json_response.latitude, json_response.longitude);
		
		drawLibrary(canvas_context, json_response.ySize, json_response.xSize, json_response.insideAppearance);
		
		// get the request sender
		var senderAdminID = selectedRequest.administratorId;
		const URL3 = URLprefix + "administrators/" + senderAdminID;
		const response2 = await make_request(URL3, "GET", JSON_headers, null);
		const json_response2 = await response2.json();
		requestSenderInput.value = "ID: "+ json_response2.id + ", korisni??ko ime: " + json_response2.username;
	});
	
	var allowRegistrationButton = document.getElementById("activate_library");
	var denyLibraryRegistrationButton = document.getElementById("reject_library_activation");
	
	async function processRequest(allow)
	{	
		if(globalTempVariable2 == null)
		{
			alert("Prvo odaberite zahtjev");
			return;
		}
		// delete the request
		globalTempVariable2.approved = allow;
		var tempURL = URLprefix + "requests/" + globalTempVariable2.id;
		var requestResponse = await make_request(tempURL, "DELETE", JSON_headers, null);
		if(!requestResponse.ok)
		{
			alert("Gre??ka");
			return;
		}
		
		// set the status
		globalTempVariable1.active = allow;
		var updateDataURL = URLprefix + "reading-rooms/" + globalTempVariable1.id;
		var updateResponse = await make_request(updateDataURL, "PUT", JSON_headers, JSON.stringify(globalTempVariable1));
		if(!updateResponse.ok)
		{
			alert("Gre??ka");
			return;
		}
		
		
		// remove the element from the select
		var options = selectElement.options;
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].value == globalTempVariable2.id)
			{
				libraryNameInput.value = "";
				requestSenderInput.value = "";
				selectElement.removeChild(options[i]);
				break; 
			}
		}	
		globalTempVariable2 = null;	
			
		alert("Operacija uspje??na");
	}
	
	allowRegistrationButton.addEventListener("click", function()
	{
		processRequest(true);
		// updateRequest(requestJSONobject)
		//globalTempVariable2.approved = true;
		//updateRequest(globalTempVariable2);
	});
	
	denyLibraryRegistrationButton.addEventListener("click", async function()
	{
		processRequest(false);
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


library_activations_panel_activation();
