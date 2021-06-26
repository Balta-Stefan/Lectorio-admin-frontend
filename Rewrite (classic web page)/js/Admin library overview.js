async function activate_administrator_library_overview_panel()
{
	// globalTempVariable3 holds the selected library
	
	globalTempVariable3 = null;
	// draw on the canvas
	canvas_setup();
	canvas_draw_lines();
	
	// register the submit button event
	//document.getElementById("library_registration_submit_button").onclick = register_library;
	
	
	// get the list of own all reading rooms
	
	const URL = URLprefix + "administrators/" + ownID + "/reading-rooms";
	const response = await make_request(URL, "GET", JSON_headers, null);
	globalTempVariable = await response.json();
	
	var librariesSelect = document.getElementById("admin_list_of_libraries");
	
	for(var i = 0; i < globalTempVariable.length; i++)
		librariesSelect.innerHTML += '<option value="' + globalTempVariable[i].id + '">' + "ID: " + globalTempVariable[i].id + ", Ime: " + globalTempVariable[i].name + '</option>';
	
	var adminSelect = document.getElementById("admin_library_administrators");
	librariesSelect.addEventListener("change", async function(event)
	{
		
		var selectedID = event.target.value;
		globalTempVariable3 = globalTempVariable.find(toFind => toFind.id == selectedID);
		
		//var latitude_input = document.getElementById("latitude_input");
		//var longitude_input = document.getElementById("longitude_input");
		var address_input = document.getElementById("address_input");
		var name_input = document.getElementById("name_input");
		var thumbnail_input = document.getElementById("thumbnail_input");
		var other_images_input = document.getElementById("other_images_input");
		//var opening_time_input = document.getElementById("opening_time_input");
		//var closing_time_input = document.getElementById("closing_time_input");
		var activation_status_input = document.getElementById("activation_status_input");
		//var number_of_seats_input = document.getElementById("number_of_seats_input");
		var type_of_reading_room = document.getElementById("type_of_reading_room");
		
		
		
		var reading_room_thumbnail = document.getElementById("admin_library_picture");
		reading_room_thumbnail.src = globalTempVariable3.readingRoomListImage;
		
		
		//latitude_input.value = globalTempVariable3.latitude;
		//longitude_input.value = globalTempVariable3.longitude;
		address_input.value = globalTempVariable3.address;
		name_input.value = globalTempVariable3.name;
		thumbnail_input.value = globalTempVariable3.readingRoomListImage;
		other_images_input.value = globalTempVariable3.images;
		//opening_time_input.value = globalTempVariable3.openingTime;
		//closing_time_input.value = globalTempVariable3.closingTime
		activation_status_input.value = globalTempVariable3.active === true ? "Aktivna" : "Neaktivna";
		//number_of_seats_input.value = globalTempVariable3.numberOfSeats;
		type_of_reading_room.value = globalTempVariable3.readingRoomType;
		
		// get the administrators of the reading room
		var tmpURL = URLprefix + "reading-rooms/" + globalTempVariable3.id + "/administrators";
		var allAdmins = await make_request(tmpURL, "GET", JSON_headers, null);
		allAdmins = await allAdmins.json();
		
		
		adminSelect.innerHTML = "";
		for(var i = 0; i < allAdmins.length; i++)
		{
			adminSelect.innerHTML += '<option value="' + allAdmins[i].id + '">' + "ID: " + allAdmins[i].id + ", Ime: " + allAdmins[i].username + '</option>';
		}
		
		// draw the library layout
		drawLibrary(canvas_context, globalTempVariable3.ySize, globalTempVariable3.xSize, globalTempVariable3.insideAppearance);
	});
	
	var deactivateButton = document.getElementById("admin_deactivate_library_btn");
	deactivateButton.addEventListener("click", async function()
	{
		var URL = URLprefix + "reading-rooms/" + globalTempVariable3.id;
		globalTempVariable3.active = false;
		var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(globalTempVariable3));
		if(response.ok == false)
		{
			alert("Deaktivacija neuspješna");
			return;
		}
		activation_status_input.value = globalTempVariable3.active === true ? "Aktivna" : "Neaktivna";
		alert("Deaktivacija uspješna");
	});
	
	var overviewForm = document.getElementById("library_overview_form");
	overviewForm.addEventListener("submit", async function(event)
	{
		event.preventDefault();
		if(globalTempVariable3 == null)
		{
			alert("Prvo odaberite čitaonicu!");
			return;
		}
		
		var formData = new FormData(this);
		var formData_JSON_string = FormData_to_JSON(formData);
		var formData_JSON = JSON.parse(formData_JSON_string);
		
		/*if(validateTimeFormat(formData_JSON.openingTime) == false || validateTimeFormat(formData_JSON.closingTime) == false)
		{
			alert("Unesite vrijeme u formatu HH:mm");
			return;
		}*/
		
		formData_JSON.id = globalTempVariable3.id;
		formData_JSON.active = globalTempVariable3.active;
		//formData_JSON.insideAppearance = globalTempVariable3.insideAppearance;
		formData_JSON.xSize = globalTempVariable3.xSize;
		formData_JSON.ySize = globalTempVariable3.ySize;
		
		formData_JSON.images = formData_JSON.images.split(",");
		for(var i = 0; i < formData_JSON.images.length; i++)
			formData_JSON.images[i] = formData_JSON.images[i].trimStart();
		
		
		console.log("server receives: ");
		console.log(JSON.stringify(formData_JSON));
		var tmpURL = URLprefix + "reading-rooms/" + globalTempVariable3.id;
		var response = await make_request(tmpURL, "PUT", JSON_headers, JSON.stringify(formData_JSON));
		
		if(!response.ok)
		{
			alert("Izmjena informacija neuspješna");
			return;
		}
		alert("Izmjena informacija uspješna");
	});
	
	var addAdminButton = document.getElementById("admin_library_overview_add_new_admin_button");
	addAdminButton.addEventListener("click", async function()
	{
		var newAdminsUsername = document.getElementById("admin_library_overview_add_new_admin_input").value;
		
		if(newAdminsUsername === "")
		{
			alert("Prvo unesite ime administratora!");
			return;
		}
		if(globalTempVariable3 == null)
		{
			alert("Prvo odaberite čitaonicu!");
			return;
		}
		
		// send a request
		var requestJSON = {"username" : newAdminsUsername}
		var requestURL = URLprefix + "reading-rooms/" + globalTempVariable3.id + "/administrators";
		var response = await make_request(requestURL, "POST", JSON_headers, JSON.stringify(requestJSON));
		
		if(!response.ok)
		{
			alert("Dodavanje novog administratora neuspješno.");
			return;
		}
		
		var newAdmin = await response.json();
		// add the new admin to the select element
		
		adminSelect.innerHTML += '<option value="' + newAdmin.id + '">' + "ID: " + newAdmin.id + ", Ime: " + newAdminsUsername + '</option>';
		
		alert("Dodavanje novog administratora uspješno.");
	});
}
disableCanvasEvents = true;
activate_administrator_library_overview_panel();