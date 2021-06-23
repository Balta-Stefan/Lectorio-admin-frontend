async function activate_administrator_library_overview_panel()
{
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
	
	
	librariesSelect.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		globalTempVariable3 = globalTempVariable.find(toFind => toFind.id == selectedID);
		
		var latitude_input = document.getElementById("latitude_input");
		var longitude_input = document.getElementById("longitude_input");
		var address_input = document.getElementById("address_input");
		var name_input = document.getElementById("name_input");
		
		latitude_input.value = globalTempVariable3.latitude;
		longitude_input.value = globalTempVariable3.longitude;
		address_input.value = globalTempVariable3.address;
		name_input.value = globalTempVariable3.name;
		
		// get the administrators of the reading room
		var tmpURL = URLprefix + "reading-rooms/" + globalTempVariable3.id + "/administrators";
		var allAdmins = await make_request(tmpURL, "GET", JSON_headers, null);
		allAdmins = await allAdmins.json();
		
		var adminSelect = document.getElementById("admin_library_administrators");
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
		alert("Deaktivacija uspješna");
	});
	
	var overviewForm = document.getElementById("library_overview_form");
	overviewForm.addEventListener("submit", async function(event)
	{
		event.preventDefault();
		var formData = new FormData(this);
		var formData_JSON_string = FormData_to_JSON(formData);
		var formData_JSON = JSON.parse(formData_JSON_string);
		
		formData_JSON.id = globalTempVariable3.id;
		formData_JSON.active = globalTempVariable3.active;
		formData_JSON.insideAppearance = globalTempVariable3.insideAppearance;
		formData_JSON.xSize = globalTempVariable3.xSize;
		formData_JSON.ySize = globalTempVariable3.ySize;
		
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
		
		// send a request
		var requestJSON = {"username" : newAdminsUsername}
		var requestURL = URLprefix + "reading-rooms/" + globalTempVariable3.id + "/administrators";
		var response = await make_request(requestURL, "POST", JSON_headers, JSON.stringify(requestJSON));
		
		if(!response.ok)
		{
			alert("Dodavanje novog administratora neuspješno.");
			return;
		}
		alert("Dodavanje novog administratora uspješno.");
	});
}
activate_administrator_library_overview_panel();