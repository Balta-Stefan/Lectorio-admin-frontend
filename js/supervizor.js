/* 
	appendChild only moves a node.
	When using templates, this means that removing an instance of the template will remove it permanently
	so that the template will be gone forever.
	That's why it must be cloned (there seem to be 2 methods, importNode and cloneNode)
	
	Canvas:
	-canvas_context.beginPath(); has to be called before each drawing.The reason for this is that everything that was drawn will be redrawn for each new stroke()
	 and all the items will keep getting darker because the colors accumulate
	
	//https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
	
	
	
	Library layout color character meanings:
		canvas_string_representation_character - stores obe of the chars below
		
		D - vrata (door)
		T - sto (table)
		_ - prazno
		P - mjesto s uticnicom
		S - standardno mjesto
	
*/

function activate_template(destination, template_id)
{
	var template = document.getElementById(template_id);
	var clone = document.importNode(template.content, true);
	destination.appendChild(clone);
}

function remove_panel_elements()
{
	while(panel_children.firstChild)
		panel_children.firstChild.remove();
}

async function updateRequest(requestJSONobject)
{
	var URL = "http://localhost:8080/api/v1/requests/" + requestJSONobject.id;
	
	var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(requestJSONobject));
	//const json_response = await response.json();
}

async function getAdmin(adminID)
{
	var answer = await make_request("http://localhost:8080/api/v1/administrators/" + adminID, "GET", JSON_headers, null);
	var answer_JSON = await answer.json();
	return answer_JSON;
}

async function admin_requests_panel_activation()
{
	// globalTempVariable holds all the requests
	// globalTempVariable2 holds the selected request
	
	remove_panel_elements();
	activate_template(panel_children, "admin_registration_requests");
	panel_header_name.innerHTML = "Pregled zahtjeva za registraciju administratora"
	
	// get all requests
	//make_request(URL, method, headers, body_content)
	const answer = await make_request("http://localhost:8080/api/v1/requests", "GET", JSON_headers, null);
	const answer_JSON = await answer.json();
	globalTempVariable = answer_JSON;
	
	// populate the select element
	var selectElement = document.getElementById("admin_registration_requests_select");
	for(var i = 0; i < answer_JSON.length; i++)
	{
		if(answer_JSON[i].readingRoomId != null) // skip reading room requests
			continue
		selectElement.innerHTML = selectElement.innerHTML + '<option value="' + answer_JSON[i].id + '">' + "ID zahtjeva: " + answer_JSON[i].id + '</option>';
	}
	var adminNameInput = document.getElementById("request_name");
	var adminEmailInput = document.getElementById("request_email");
	
	selectElement.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		var selectedRequest = globalTempVariable.find(toFind => toFind.id == selectedID);
		globalTempVariable2 = selectedRequest;
		
		const URL = "http://localhost:8080/api/v1/administrators/" + selectedRequest.administratorId;
		const method = "GET";
		var response = await make_request(URL, method, JSON_headers, null);
		var json_response = await response.json();
		
		if(!response.ok)
			return;
		// populate admin data		
		adminNameInput.value = json_response.username;
		adminEmailInput.value = json_response.email;
	});
	
	var allowRegistrationButton = document.getElementById("allow_registration_btn");
	var denyAdminRegistrationButton = document.getElementById("reject_administration_btn");
	
	async function processRequest(allow)
	{
		// set the request to allowed...
		globalTempVariable2.approved = allow;
		var URL = "http://localhost:8080/api/v1/requests/" + globalTempVariable2.id;
		var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
		if(response.ok == false)
		{
			alert("Greška");
			return;
		}
		// now actually activate the admin...
		var adminJSON = await getAdmin(globalTempVariable2.administratorId);
		adminJSON.activated = allow;
		var URL = "http://localhost:8080/api/v1/administrators/" + adminJSON.id;
		var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(adminJSON));
		if(response.ok == false)
		{
			alert("Greška");
			return;
		}
		// delete the request
		var tempURL = "http://localhost:8080/api/v1/requests/" + globalTempVariable2.id;
		await make_request(tempURL, "DELETE", JSON_headers, null);
		// remove the element from the select
		var options = selectElement.options;
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].value == globalTempVariable2.id)
			{
				adminNameInput.value = "";
				adminEmailInput.value = "";
				selectElement.removeChild(options[i]);
				break; 
			}
		}
	}
	
	allowRegistrationButton.addEventListener("click", async function()
	{
		processRequest(true);
		/*globalTempVariable2.approved = true;
		console.log(globalTempVariable2);
		await updateRequest(globalTempVariable2);
		
		// activate the admin once again
		var adminJSON = await getAdmin(globalTempVariable2.administratorId);
		adminJSON.activated = true;
		console.log("adminJSON");
		console.log(adminJSON);
		
		var URL = "http://localhost:8080/api/v1/administrators/" + adminJSON.id;
		var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(adminJSON));*/
	});
	
	denyAdminRegistrationButton.addEventListener("click", async function()
	{
		processRequest(false);
		/*globalTempVariable2.approved = false;
		console.log(globalTempVariable2);
		updateRequest(globalTempVariable2);
		
		// activate the admin once again
		var adminJSON = await getAdmin(globalTempVariable2.administratorId);
		adminJSON.activated = false;
		console.log("adminJSON");
		console.log(adminJSON);
		
		var URL = "http://localhost:8080/api/v1/administrators/" + adminJSON.id;
		var response = await make_request(URL, "PUT", JSON_headers, JSON.stringify(adminJSON));*/
	});
}

async function library_activations_panel_activation()
{
	remove_panel_elements();
	panel_header_name.innerHTML = "Aktivacije čitaonica";
	activate_template(panel_children, "library_activations_template");
	
	// get all requests
	//make_request(URL, method, headers, body_content)
	const answer = await make_request("http://localhost:8080/api/v1/requests", "GET", JSON_headers, null);
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
	
	var locationInput = document.getElementById("activation_library_location");
	var libraryNameInput = document.getElementById("activation_library_name");
	var requestSenderInput = document.getElementById("activation_library_request_sender");
	
	selectElement.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		var selectedRequest = globalTempVariable.find(toFind => toFind.id == selectedID);
		globalTempVariable2 = selectedRequest;
		
		const URL = "http://localhost:8080/api/v1/reading-rooms/" + selectedRequest.readingRoomId;
		const response = await make_request(URL, "GET", JSON_headers, null);
		const json_response = await response.json();
		
		if(!response.ok)
			return;
		// populate admin data
		locationInput.value = json_response.address;
		libraryNameInput.value = json_response.name;
		
		// get the request sender
		var senderAdminID = selectedRequest.administratorId;
		const URL2 = "http://localhost:8080/api/v1/administrators/" + senderAdminID;
		const response2 = await make_request(URL2, "GET", JSON_headers, null);
		const json_response2 = await response2.json();
		requestSenderInput.value = "ID: "+ json_response2.id + ", username: " + json_response2.username;
	});
	
	var allowRegistrationButton = document.getElementById("activate_library");
	var denyLibraryRegistrationButton = document.getElementById("reject_library_activation");
	
	async function processRequest(allow)
	{	
		// delete the request
		var tempURL = "http://localhost:8080/api/v1/requests/" + globalTempVariable2.id;
		await make_request(tempURL, "DELETE", JSON_headers, null);
		// remove the element from the select
		var options = selectElement.options;
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].value == globalTempVariable2.id)
			{
				locationInput.value = "";
				libraryNameInput.value = "";
				requestSenderInput.value = "";
				selectElement.removeChild(options[i]);
				break; 
			}
		}		
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
		// updateRequest(requestJSONobject)
		//globalTempVariable2.approved = false;
		//updateRequest(globalTempVariable2);
		
		// delete the request
		//const URL = "http://localhost:8080/api/v1/requests/" + globalTempVariable2.id;
		//const method = "DELETE";
		
		//const response = await make_request(URL, method, JSON_headers, JSON.stringify(globalTempVariable2));
	});

}

function supervisor_obrada_zahtjeva_click()
{
	panel_header_name.innerHTML = "Obrada zahtjeva";
	
	remove_panel_elements();
	
	activate_template(panel_children, "supervisor_requests");
	
	document.getElementById("admin_registration_requests_btn").addEventListener("click", admin_requests_panel_activation);
	document.getElementById("library_activation_requests_btn").addEventListener("click", library_activations_panel_activation);
}

async function pregled_administratora_click()
{
	panel_header_name.innerHTML = "Pregled administratora";
	remove_panel_elements();
	
	activate_template(panel_children, "supervisor_admin_overview");
	
	// populate the select with admins
	const answer = await make_request("http://localhost:8080/api/v1/administrators", "GET", JSON_headers, null);
	const answer_JSON = await answer.json();
	globalTempVariable = answer_JSON;
	var selectElement = document.getElementById("supervisor_admin_select");
	for(var i = 0; i < answer_JSON.length; i++)
		selectElement.innerHTML = selectElement.innerHTML + '<option value="' + answer_JSON[i].id + '">' + "ID: " + answer_JSON[i].id + ", Ime: " + answer_JSON[i].username + '</option>';
	
	var adminActivatedInput = document.getElementById("admin_is_activated");
	
	selectElement.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		var selectedAdmin = globalTempVariable.find(toFind => toFind.id == selectedID);
		globalTempVariable2 = selectedAdmin;
		
		// get his reading rooms
		var URL = "http://localhost:8080/api/v1/administrators/" + globalTempVariable2.id + "/reading-rooms";
		var response = await make_request(URL, "GET", JSON_headers, null);
		globalTempVariable3 = await response.json();
		
		// populate the listview of reading rooms
		var selectElement = document.getElementById("admin_overview_library_list");
		selectElement.innerHTML = "";
		selectElement.innerHTML += '<option selected style="display:none;">' + "Spisak čitaonica" + '</option>';
		for(var i = 0; i < globalTempVariable3.length; i++)
			selectElement.innerHTML = selectElement.innerHTML + "<option>" + "ID: " + globalTempVariable3[i].id + ", Ime: "+ globalTempVariable3[i].name + "</option>";
		
		// fill the input elements with the selected admin's data
		var adminEmailInput = document.getElementById("admin_email");
		
		
		adminEmailInput.value = selectedAdmin.email;
		if(selectedAdmin.activated == true)
			adminActivatedInput.value = "Da";
		else
			adminActivatedInput.value = "Ne";
	});
	
	var deactivateButton = document.getElementById("deactivate_admin_account");
	var activateButton = document.getElementById("activate_admin_account");
	
	async function changeActivationStatus(activate)
	{
		var adminDeactivationURL = "http://localhost:8080/api/v1/administrators/" + globalTempVariable2.id;
		globalTempVariable2.activated = activate;
		
		var response = await make_request(adminDeactivationURL, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
		
		return response;
	}
	
	deactivateButton.addEventListener("click", async function()
	{
		// deactivate the administrator
		if(globalTempVariable2.activated == false)
		{
			alert("Odabrani nalog je već deaktiviran.");
			return;
		}
		var response = changeActivationStatus(false);
		
		if(response.ok == false)
		{
			alert("Deaktivacija neuspješna");
			return;
		}
		adminActivatedInput.value = "Ne";
	});
	
	activateButton.addEventListener("click", async function()
	{
		// activate the administrator
		if(globalTempVariable2.activated == true)
		{
			alert("Odabrani nalog je već aktiviran.");
			return;
		}	
		var response = changeActivationStatus(true);
		
		if(response.ok == false)
		{
			alert("Aktivacija neuspješna");
			return;
		}
		
		adminActivatedInput.value = "Da";
	});
}



function postavke_click()
{
	panel_header_name.innerHTML = "Postavke";
	remove_panel_elements();
	
	// to do	
	activate_template(panel_children, "supervisor_settings_template");
}


function addEventToClass(classElements, callback)
{
	for(var i = 0; i < classElements.length; i++)
		classElements[i].addEventListener("click", callback);
}

function admin_registracija_citaonica_click()
{
	panel_header_name.innerHTML = "Registracija čitaonica";
	remove_panel_elements();
	
	activate_template(panel_children, "admin_library_registration");
	
	var canvas_area = document.getElementById("admin_library_registration_canvas_wrapper");
	activate_template(canvas_area, "library_layout_drawing_template");
	
	canvas_setup();
	canvas_draw_lines();
	
	var library_registration_form = document.getElementById("library_registration_form");
	
	library_registration_form.addEventListener("submit", async function(event)
	{
		event.preventDefault();
		
		const formData = new FormData(this);
		const formData_JSON_string = FormData_to_JSON(formData);
		
		const formData_JSON = JSON.parse(formData_JSON_string);
		var libraryHeight = canvas_horizontal_slider.value;
		var libraryWidth = canvas_vertical_slider.value;
		formData_JSON.xSize = libraryWidth;
		formData_JSON.ySize = libraryHeight;
		
		// convert array to a string
		var tmpString = canvas_drawn_cells_array.join("");
		formData_JSON.insideAppearance = tmpString;
		//formData_JSON.active = "true";
		
		
		// create a reading room
		const URL = "http://localhost:8080/api/v1/reading-rooms";
		const method = "POST";
		const response = await make_request(URL, method, JSON_headers, JSON.stringify(formData_JSON));
		const json_response = await response.json();
		
		if(!response.ok)
		{
			alert("Registracija čitaonice neuspješna");
			return;
		}
		
		// make a reading room registration request...
		const newRequestURL = "http://localhost:8080/api/v1/requests";
		const requestJSON = make_activation_request("readingRoomActivationRequest", json_response.id);
		requestJSON.administratorId = ownID
		console.log("requestJSON");
		console.log(requestJSON);
		var response2 = await make_request(newRequestURL, method, JSON_headers, JSON.stringify(requestJSON));

		if(!response2.ok)
		{
			alert("Registracija čitaonice neuspješna");
			return;
		}
		
		response2 = await response2.json();
		console.log("response2");
		console.log(response2);
		
		
		// assign the reading room to the administrator...
		var URL2 = "http://localhost:8080/api/v1/reading-rooms/" + json_response.id + "/administrators";
		var reqBody = {"username" : ownUsername};
		/*var URL2 = "http://localhost:8080/api/v1/administrators/" + ownID + "/reading-rooms";
		console.log(URL2);
		var reqBody = {"id" : response2.readingRoomId}
		console.log(reqBody);*/
		var response3 = await make_request(URL2, "POST", JSON_headers, JSON.stringify(reqBody));
		
		if(!response3.ok)
		{
			alert("Registracija čitaonice neuspješna");
			return;
		}		

		alert("Registracija čitaonice uspješna");
		
	});
}

async function supervisor_pregled_citaonica_click()
{
	// globalTempVariable holds all the reading rooms (as JSON array)
	// globalTempVariable2 holds the selected reading room
	
	panel_header_name.innerHTML = "Pregled čitaonica";
	remove_panel_elements();
	
	activate_template(panel_children, "supervisor_library_overview");
	
	globalTempVariable = await make_request("http://localhost:8080/api/v1/reading-rooms", "GET", JSON_headers, null);
	if(!globalTempVariable.ok)
	{
		alert("Greška");
		return;
	}
	globalTempVariable = await globalTempVariable.json();
	
	// populate the reading room select
	var selectElement = document.getElementById("admin_list_of_libraries");
	for(var i = 0; i < globalTempVariable.length; i++)
		selectElement.innerHTML = selectElement.innerHTML + '<option value="' + globalTempVariable[i].id + '">' + "ID čitaonice: " + globalTempVariable[i].id + ", Ime: " + globalTempVariable[i].name + '</option>';
		
	selectElement.addEventListener("change", async function(event)
	{
		var selectedReadingroomID = event.target.value;
		globalTempVariable2 = globalTempVariable.find(toFind => toFind.id == selectedReadingroomID);
		
		// populate the administrators list
		var addressInput = document.getElementById("admin_library_address");
		var URL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable2.id + "/administrators";
		var listOfAdmins = await make_request(URL, "GET", JSON_headers, null);
		var adminsSelect = document.getElementById("admin_library_administrators");
		
		
		for(var i = 0; i < listOfAdmins.length; i++)
		{
			adminsSelect.innerHTML += "<option>" + "ID: " + listOfAdmins[i].id + ", Ime: " + listOfAdmins[i].username + "</option>"
		}
		addressInput.value = globalTempVariable2.address;
		
	}); 
	
	var deactivateButton = document.getElementById("admin_deactivate_library_btn");
	deactivateButton.addEventListener("click", async function()
	{
		var URL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable2.id;
		globalTempVariable2.active = false;
		await make_request(URL, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
	});
}

function drawLibrary(canvasContext, num_of_horizontal_lines, num_of_vertical_lines, layoutString)
{
	// canvas HTML element dimensions are separated from the canvas' context dimensions
	// these context dimensions have to be set to the dimensions of the HTML canvas element
	
	canvas_horizontal_slider.value = num_of_horizontal_lines;
	canvas_vertical_slider.value = num_of_vertical_lines;
	
	canvas_height = canvas_context.canvas.height = canvasH;
	canvas_width = canvas_context.canvas.width = canvasW;
		
	horizontal_step = canvas_width / num_of_vertical_lines;
	vertical_step = canvas_height / num_of_horizontal_lines;
		
	canvas_context.beginPath();
	for(x = horizontal_step; x <= canvas_width; x += horizontal_step)
	{
		canvas_context.moveTo(x, 0);
		canvas_context.lineTo(x, canvas_height);
	}
	for(y = vertical_step; y <= canvas_height; y += vertical_step)
	{
		canvas_context.moveTo(0, y);
		canvas_context.lineTo(canvas_width, y);
	}
	
	// paint the cells
	/*var drawX = selected_cell_x * horizontal_step;
	var drawY = selected_cell_y * vertical_step;
	
	// offsets in fillRect are there because white color will remove borders
	canvas_context.beginPath();
	canvas_context.fillStyle = canvas_drawing_color;
	canvas_context.fillRect(drawX+1, drawY+1, horizontal_step-2, vertical_step-2);
	canvas_context.stroke();*/
	var layoutStringCounter = 0;
	
	var yCoord = 0;
	for(y = 0; y < num_of_horizontal_lines; y++)
	{
		var xCoord = 0;
		for(x = 0; x < num_of_vertical_lines; x++)
		{
			canvas_context.fillStyle = colorMap[layoutString[layoutStringCounter++]];
			canvas_context.fillRect(xCoord+1, yCoord+1, horizontal_step-2, vertical_step-2);
			
			xCoord += horizontal_step;
		}
		yCoord += vertical_step;
	}
	
    canvas_context.stroke();
}

async function admin_pregled_citaonica_click()
{
	// globalTempVariable holds all the libraries of the administrator
	// globalTempVariable2 holds all the admins of a library
	// globalTempVariable3 holds the selected library
	
	panel_header_name.innerHTML = "Pregled čitaonica";
	remove_panel_elements();
	
	activate_template(panel_children, "admin_library_overview");
	
	
	var canvas_area = document.getElementById("admin_library_layout_picture_container");
	activate_template(canvas_area, "library_layout_drawing_template");

	// draw on the canvas
	canvas_setup();
	canvas_draw_lines();
	
	// register the submit button event
	//document.getElementById("library_registration_submit_button").onclick = register_library;
	
	
	// get the list of own all reading rooms
	
	const URL = "http://localhost:8080/api/v1/administrators/" + ownID + "/reading-rooms";
	const method = "GET";
	const response = await make_request(URL, method, JSON_headers, null);
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
		var tmpURL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable3.id + "/administrators";
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
		var URL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable3.id;
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
		
		var tmpURL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable3.id;
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
		var requestURL = "http://localhost:8080/api/v1/reading-rooms/" + globalTempVariable3.id + "/administrators";
		var response = await make_request(requestURL, "POST", JSON_headers, JSON.stringify(requestJSON));
		
		if(!response.ok)
		{
			alert("Dodavanje novog administratora neuspješno.");
			return;
		}
		alert("Dodavanje novog administratora uspješno.");
	});
}


function canvas_entrance_button_clicked()
{
	canvas_drawing_color = "black";
	canvas_string_representation_character = door;
}
function canvas_standard_seat_button_clicked()
{
	canvas_drawing_color = "orange";
	canvas_string_representation_character = standard_seat;
}
function canvas_socket_seat_button_clicked()
{
	canvas_drawing_color = "blue";
	canvas_string_representation_character = socket_seat;
}
function canvas_table_button_clicked()
{
	canvas_drawing_color = "brown";
	canvas_string_representation_character = table;
}
function canvas_reset_button_clicked()
{
	canvas_drawing_color = "white";
	canvas_string_representation_character = empty_cell;
}

function canvas_click_event(event)
{
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
	
	var selected_cell_x = Math.floor(x / horizontal_step);
	var selected_cell_y = Math.floor(y / vertical_step);
	
	var libraryHeight = canvas_horizontal_slider.value;
	var libraryWidth = canvas_vertical_slider.value;
	canvas_drawn_cells_array[selected_cell_y*libraryWidth + selected_cell_x] = canvas_string_representation_character;
	//canvas_drawn_cells_array[selected_cell_y][selected_cell_x] = canvas_string_representation_character;
	
	var drawX = selected_cell_x * horizontal_step;
	var drawY = selected_cell_y * vertical_step;
	//alert(selected_cell_x);
	//alert(selected_cell_y);
	
	// offsets in fillRect are there because white color will remove borders
	canvas_context.beginPath();
	canvas_context.fillStyle = canvas_drawing_color;
	canvas_context.fillRect(drawX+1, drawY+1, horizontal_step-2, vertical_step-2);
	canvas_context.stroke();
}

function canvas_setup()
{
	canvas_horizontal_slider = document.getElementById("canvas_num_of_verticall_lines");
	canvas_vertical_slider = document.getElementById("canvas_num_of_horizontal_lines");
	canvas_entrance_button_clicked();
	
	var slider_class = document.querySelectorAll(".canvas_slider");
	addEventToClass(slider_class, canvas_draw_lines);
	
	canvas = document.getElementById("drawing_canvas");
	canvas.addEventListener('click', canvas_click_event);
	canvas_context = canvas.getContext("2d");
	canvas_context.lineWidth = 1;
	
	canvasW = document.getElementById('drawing_canvas').offsetWidth;
	canvasH = document.getElementById('drawing_canvas').offsetHeight;
	
	// prepare the button events
	document.getElementById("canvas_entry").onclick = canvas_entrance_button_clicked;
	document.getElementById("canvas_standard_seat").onclick = canvas_standard_seat_button_clicked;
	document.getElementById("canvas_socket_seat").onclick = canvas_socket_seat_button_clicked;
	document.getElementById("canvas_table").onclick = canvas_table_button_clicked;
	document.getElementById("canvas_remove_elements").onclick = canvas_reset_button_clicked;
}

function canvas_draw_lines()
{
	var num_of_horizontal_lines = canvas_horizontal_slider.value;
	var num_of_vertical_lines = canvas_vertical_slider.value;
	console.log("horizontal: " + num_of_horizontal_lines + ", vertical: " + num_of_vertical_lines);
	
	// allocate a 2D array that will hold cell values
	canvas_drawn_cells_array = new Array(num_of_horizontal_lines*num_of_vertical_lines);
	for(var i = 0; i < num_of_horizontal_lines*num_of_vertical_lines; i++)
		canvas_drawn_cells_array[i] = empty_cell;
	/*for(var i = 0; i < num_of_horizontal_lines; i++)
	{
		canvas_drawn_cells_array[i] = new Array(num_of_vertical_lines);
		for(var j = 0; j < num_of_vertical_lines; j++)
			canvas_drawn_cells_array[i][j] = empty_cell;
	}*/
	
	// drawLibrary(canvasContext, numOfHorizontalLines, numOfVerticalLines, layoutString)
	drawLibrary(canvas_context, num_of_horizontal_lines, num_of_vertical_lines, canvas_drawn_cells_array);
	
	/*
	// canvas HTML element dimensions are separated from the canvas' context dimensions
	// these context dimensions have to be set to the dimensions of the HTML canvas element
	canvas_height = canvas_context.canvas.height = canvasH;
	canvas_width = canvas_context.canvas.width = canvasW;
	
	
	horizontal_step = canvas_width / num_of_horizontal_lines;
	vertical_step = canvas_height / num_of_vertical_lines;
		
	canvas_context.beginPath();
	for(x = horizontal_step; x <= canvas_width; x += horizontal_step)
	{
		canvas_context.moveTo(x, 0);
		canvas_context.lineTo(x, canvas_height);
	}
	for(y = vertical_step; y <= canvas_height; y += vertical_step)
	{
		canvas_context.moveTo(0, y);
		canvas_context.lineTo(canvas_width, y);
	}
	
    canvas_context.stroke();*/
}


async function admin_obavjestenja_click()
{
	// globalTempVariable holds all the reading rooms of the administrator
	// globalTempVariable2 holds all the announcements of a library
	// globalTempVariable3 holds the currently selected library
	// globalTempVariable4 holds the currently selected announcement
	
	// an empty announcement with ID = -1 is used to create a new announcement
	
	globalTempVariable3 = null;
	globalTempVariable4 = null;
	
	panel_header_name.innerHTML = "Obavještenja";
	remove_panel_elements();
	
	activate_template(panel_children, "admin_library_notifications_panel");
	
	// get the list of own all reading rooms
	
	const URL = "http://localhost:8080/api/v1/administrators/" + ownID + "/reading-rooms";
	const method = "GET";
	const response = await make_request(URL, method, JSON_headers, null);
	globalTempVariable = await response.json();
	
	var librariesSelect = document.getElementById("admin_notifications_list_of_libraries");
	
	for(var i = 0; i < globalTempVariable.length; i++)
		librariesSelect.innerHTML += '<option value="' + globalTempVariable[i].id + '">' + "ID: " + globalTempVariable[i].id + ", Ime: " + globalTempVariable[i].name + '</option>';

	var announcementsSelect = document.getElementById("admin_notifications_select");

	librariesSelect.addEventListener("change", async function(event)
	{
		var selectedLibraryID = event.target.value;
		globalTempVariable3 = globalTempVariable.find(toFind => toFind.id == selectedLibraryID);
		
		// get all the notifications
		var tmpURL = "http://localhost:8080/api/v1/reading-rooms/" + selectedLibraryID + "/announcements";
		globalTempVariable2 = await make_request(tmpURL, "GET", JSON_headers, null);
		if(!globalTempVariable2.ok)
			return;
		globalTempVariable2 = await globalTempVariable2.json();
		
		announcementsSelect.innerHTML = "";
		announcementsSelect.innerHTML += '<option selected style="display:none;">' + "Spisak obavještenja" + '</option>';
		announcementsSelect.innerHTML += '<option value="-1">' + "Dodaj novo" + '</option>';
		//<option selected style="display:none;">Spisak obavještenja</option>
		for(var i = 0; i < globalTempVariable2.length; i++)
		{
			announcementsSelect.innerHTML += '<option value="' + globalTempVariable2[i].id + '">' + "ID: " + globalTempVariable2[i].id + ", Naslov: " + globalTempVariable2[i].title + '</option>';
		}
	});
	
	announcementsSelect.addEventListener("change", async function(event)
	{
		if(globalTempVariable3 == null) return;
		var selectedAnnouncementID = event.target.value;
		if(selectedAnnouncementID == -1) return;
		globalTempVariable4 = globalTempVariable2.find(toFind => toFind.id == selectedAnnouncementID);
		
		var textarea = document.getElementById("admin_notification_textarea");
		var title = document.getElementById("announcement_title_input");
		textarea.value = globalTempVariable4.content;
		title.value = globalTempVariable4.title;
	});
	
	//http://localhost:8080/api/v1/announcements
	var sendAnnouncementButton = document.getElementById("notifications_panel_send_notification");
	sendAnnouncementButton.addEventListener("click", async function()
	{
		if(globalTempVariable3 == null)
		{
			alert("Prvo odaberite čitaonicu.");
			return;
		}
		var title = document.getElementById("announcement_title_input").value;
		var content = document.getElementById("admin_notification_textarea").value;
		var body = {"title": title, "content": content, "administratorId": ownID, "readingRoomId": globalTempVariable3.id}
		var date = new Date();
		body.creationDateTime = date.toISOString();
		var tmpUrl = "http://localhost:8080/api/v1/announcements";
		var method = null;
		
		var addingNew = true;
		
		if(globalTempVariable4 != null)
		{
			body.id = globalTempVariable4.id;
			tmpUrl += "/" + globalTempVariable4.id;
			method = "PUT";
			addingNew = false;
		}
		else
		{
			method = "POST";
		}
		var req = await make_request(tmpUrl, method, JSON_headers, JSON.stringify(body));
		var reqJSON = await req.json();
		if(req.ok == false)
		{
			console.log(await req.json());
			alert("Dodavanje neuspješno");
			return;
		}
		if(addingNew)
		{
			// add to select
			announcementsSelect.innerHTML += '<option selected value="' + reqJSON.id + '">' + "ID: " + reqJSON.id + ", Naslov: " + reqJSON.title + '</option>';
			globalTempVariable4 = reqJSON;
		}
		alert("Dodavanje uspješno");
	});
	
	var removeAnnouncementButton = document.getElementById("notification_panel_remove_notification");
	removeAnnouncementButton.addEventListener("click", async function()
	{
		if(globalTempVariable4 == null)
		{
			alert("Prvo odaberite obavještenje");
			return;
		}
		var tmpURL = "http://localhost:8080/api/v1/announcements/" + globalTempVariable4.id;
		var response = await make_request(tmpURL, "DELETE", JSON_headers, null);
		if(response.ok == false)
			alert("Brisanje neuspješno");
		else 
			alert("Brisanje uspješno");
		
	});
}

function logout()
{
	ownID = null;
	panel_header_name.innerHTML = "";
	remove_panel_elements();
	
	// remove the navigation bar
	//navigation_list var
	while(navigation_list.firstChild)
		navigation_list.removeChild(navigation_list.lastChild);
	
	login_screen();
}

function supervisor_init()
{
	// activate templates
	activate_template(document.getElementById("navigation"), "supervisor_sidenav");
	activate_template(navigation_list, "supervisor_navigation_list");
	
	var obrada_zahtjeva = document.querySelectorAll(".obrada_zahtjeva_btn");
	var pregled_administratora = document.querySelectorAll(".pregled_administratora_btn");
	var pregled_citaonica = document.querySelectorAll(".pregled_citaonica_btn");
	var postavke = document.querySelectorAll(".postavke_btn");
	var odjava = document.querySelectorAll(".logout_btn");
	
	addEventToClass(obrada_zahtjeva, supervisor_obrada_zahtjeva_click);
	addEventToClass(pregled_administratora, pregled_administratora_click);
	addEventToClass(pregled_citaonica, supervisor_pregled_citaonica_click);
	addEventToClass(postavke, postavke_click);
	addEventToClass(odjava, logout);
	
	/*document.getElementsByClassName("obrada_zahtjeva_btn").addEventListener("click", supervisor_obrada_zahtjeva_click);
	document.getElementsByClassName("pregled_administratora_btn").addEventListener("click", pregled_administratora_click);
	document.getElementsByClassName("pregled_citaonica_btn").addEventListener("click", pregled_citaonica_click);
	document.getElementsByClassName("postavke_btn").addEventListener("click", postavke_click);*/
}



function admin_init()
{
	// activate templates
	activate_template(document.getElementById("navigation"), "admin_sidenav");
	activate_template(navigation_list, "admin_navigation_list");

	
	// to do (add callbacks to buttons for admins)
	var registracija_citaonice = document.querySelectorAll(".registracija_citaonice");
	var pregled_citaonica = document.querySelectorAll(".admin_pregled_citaonica");
	var admin_obavjestenja = document.querySelectorAll(".admin_obavjestenja");
	var postavke = document.querySelectorAll(".admin_postavke_btn");
	var odjava = document.querySelectorAll(".logout_btn");
	
	addEventToClass(registracija_citaonice, admin_registracija_citaonica_click);
	addEventToClass(pregled_citaonica, admin_pregled_citaonica_click);
	addEventToClass(admin_obavjestenja, admin_obavjestenja_click);
	addEventToClass(postavke, postavke_click);
	addEventToClass(odjava, logout);
}

function make_activation_request(requestType, readingRoomID)
{
	var date = new Date();
	
	var request = {requestType: requestType,
				   supervisorId: "1",
				   readingRoomId: readingRoomID,
				   administratorId: ownID,
				   creationDateTime: date.toISOString()
				  };
	return request;
}

function registration_loginPanel_click()
{
	remove_panel_elements();
	
	activate_template(panel_children, "register_panel");
	
	const registerForm = document.getElementById("register_form");
	registerForm.addEventListener("submit", async function(event)
	{
		event.preventDefault();
		
		const formData = new FormData(this);
		const formData_JSON = FormData_to_JSON(formData);
		
		const tmp = JSON.parse(formData_JSON);
		if(tmp.password != tmp.password_confirm)
		{
			alert("Lozinke se ne podudaraju");
			return;
		}
		
		//make_request(URL, method, headers, body_content)
		const URL = "http://localhost:8080/api/v1/administrators";
		const method = "POST";
		const response = await make_request(URL, method, JSON_headers, formData_JSON);
		const json_response = await response.json();
		
		if(!response.ok)
		{
			alert("Registracija neuspješna");
			return;
		}
		
		// make another request for whatever reason...
		
		alert("Registracija uspješna");
		
		const assignedID = json_response.id;
		
		const newRequestURL = "http://localhost:8080/api/v1/requests";
		const requestJSON = make_activation_request("administratorRegistrationRequest", null);
		requestJSON.administratorId = assignedID
		const response2 = await make_request(newRequestURL, method, JSON_headers, JSON.stringify(requestJSON));
		console.log(response2);
	});
}


function openNavSupervisor() 
{
  document.getElementById("supervisor_sidenav_div").style.width = "250px";
  document.body.style.marginRight = "250px";
}

function closeNavSupervisor()
{
	document.getElementById("supervisor_sidenav_div").style.width = "0";
	document.body.style.marginRight= "0";
}

function openNavAdmin()
{
  document.getElementById("admin_sidenav_div").style.width = "250px";
  document.body.style.marginRight = "250px";
}

function closeNavAdmin()
{
	document.getElementById("admin_sidenav_div").style.width = "0";
	document.body.style.marginRight= "0";
	
}

function FormData_to_JSON(formData_object)
{
	const plainFormData = Object.fromEntries(formData_object.entries());
	const formDataJSON = JSON.stringify(plainFormData);
	return formDataJSON;
}

// returns response as an object that should be converted to JSON
async function make_request(URL, method, headers, body_content)
{
	var response = await fetch(URL,
	{
		method: method,
		headers: headers,
		body: body_content
	});
	
	//const json_response = await response.json();
	return response;
}

async function user_login(response_object)
{	
	// check if a valid cookie is present
	// to do
	//var cookieValid = new Boolean(false);
	//var user_type; // obtain from cookie
	
	
	/*
		email: "your email"
		id: your_ID_as_integer
		isAdministrator: boolean
		isSupervisor: boolean
		password: "your password"
		username: "your username"
	*/
	
	if(!response_object.ok)
	{
		alert("Prijava neuspješna");
		return;
	}
	
	const json_response = await response_object.json();
	console.log(json_response);
	
	remove_panel_elements();
	panel_header_name.innerHTML = "";
	
	ownID = json_response.id;
	ownUsername = json_response.username;
	
	if(json_response.isAdministrator == true)
	{
		admin_init();
		document.title = "Administratorski panel"
		return;
	}
	else if(json_response.isSupervisor == true)
	{
		supervisor_init();
		document.title = "Supervizorski panel"
		return;
	}
	
	/*
	// show the login panel
	panel_header_name.innerHTML = "Prijava";
	document.title = "Prijava na sistem";
	
	activate_template(panel_children, "login_panel");
	
	document.getElementById("register_button").addEventListener("click", registration_loginPanel_click);*/
}



function login_screen()
{
	// show the login panel
	panel_header_name.innerHTML = "Prijava";
	document.title = "Prijava na sistem";
	
	activate_template(panel_children, "login_panel");
	
	document.getElementById("register_button").addEventListener("click", registration_loginPanel_click);
	
	// register the login button event
	const loginForm = document.getElementById("login_form");
	loginForm.addEventListener("submit", async function(event)
	{
		event.preventDefault();
		
		const formData = new FormData(this);
		const formData_JSON = FormData_to_JSON(formData);
		
		//make_request(URL, method, headers, body_content)
		const URL = "http://localhost:8080/api/v1/administrative-users/login";
		const method = "POST";
		const response = await make_request(URL, method, JSON_headers, formData_JSON);
		//const json_response = await response.json();
		user_login(response);
		
		/*const request = async() =>
		{
			const response = await fetch("http://localhost:8080/api/v1/administrative-users/login",
			{
				method: "POST",
				headers: 
				{
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: formData_JSON
			});
			const json_response = await response.json();
			//console.log(json_response);
			//const objectResponse = JSON.parse(json_response);
			user_login(json_response);
		}
		request();*/
		
		/*fetch("http://localhost:8080/api/v1/administrative-users/login",
		{
			method: "POST",
			headers: 
			{
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: formData_JSON
		}).then(function(response)
		{
			if(!response.ok)
			{
				alert("Prijava neuspjesna");
				return;
			}
			console.log("in then response");
			const response_JSON = response.json();
			console.log("odgovor je: " + response_JSON);
		}).catch(function(error)
		{
			console.error("catch: " + error);
		});*/
		
		/*
				const fetchOptions =
				{
					method: "post",
					headers: 
					{
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					body: JSON_data
				}
				
				const response = await fetch("http://localhost:8080/api/v1/administrative-users/login", fetchOptions);
				if(!response.ok)
				{
					const errorMessage = await response.text();
					console.log(errorMessage);
					return;
				}
				
				const response_JSON = response.json();
		
		
		*/
	});
	
}

var globalTempVariable = null;
var globalTempVariable2 = null;
var globalTempVariable3 = null;
var globalTempVariable4 = null;

var ownID = null;
var ownUsername = null;

var admin = "admin";
var supervisor = "supervisor";

var navigation_list = document.getElementById("navigation_list");
var panel = document.getElementById("panel");
var panel_children = document.getElementById("panel_content");
var panel_header_name = document.getElementById("panel_header_name");

var canvas = null;
var canvas_context = null;
var canvas_horizontal_slider = null;
var canvas_vertical_slider = null;
var canvasW = 0;
var canvasH = 0;
var canvas_drawing_color = "black";
var canvas_height = null;
var canvas_width = null;
var horizontal_step = null;
var vertical_step = null;
var canvas_drawn_cells_array = null;
var canvas_string_representation_character = null;


var empty_cell = "_";
var standard_seat = "S";
var socket_seat = "P";
var table = "T";
var door = "D";


var colorMap = {};
colorMap[empty_cell] = "white";
colorMap[standard_seat] = "orange";
colorMap[socket_seat] = "blue";
colorMap[table] = "brown";
colorMap[door] = "black";

const JSON_headers = 
{
	"Content-Type": "application/json",
	"Accept": "application/json"
};

//https://stackoverflow.com/questions/42270928/cors-header-access-control-allow-origin-missing-when-making-a-request-to-diffe

//https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript

login_screen();
//activate_template(panel_children, "supervisor_settings_template");
//activate_template(panel_children, "library_overview");
//activate_template(panel_children, "supervisor_admin_overview");
//activate_template(panel_children, "library_activations_template");

//https://www.html5rocks.com/en/tutorials/webcomponents/template/
//https://www.youtube.com/watch?v=mfN-EOkj13Q