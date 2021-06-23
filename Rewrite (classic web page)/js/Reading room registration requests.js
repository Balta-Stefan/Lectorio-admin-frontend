async function library_activations_panel_activation()
{	
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
	
	var locationInput = document.getElementById("activation_library_location");
	var libraryNameInput = document.getElementById("activation_library_name");
	var requestSenderInput = document.getElementById("activation_library_request_sender");
	
	selectElement.addEventListener("change", async function(event)
	{
		var selectedID = event.target.value;
		var selectedRequest = globalTempVariable.find(toFind => toFind.id == selectedID);
		globalTempVariable2 = selectedRequest;
		
		const URL2 = URLprefix + "reading-rooms/" + selectedRequest.readingRoomId;
		const response = await make_request(URL2, "GET", JSON_headers, null);
		const json_response = await response.json();
		
		if(!response.ok)
			return;
		// populate admin data
		locationInput.value = json_response.address;
		libraryNameInput.value = json_response.name;
		
		// get the request sender
		var senderAdminID = selectedRequest.administratorId;
		const URL3 = URLprefix + "administrators/" + senderAdminID;
		const response2 = await make_request(URL3, "GET", JSON_headers, null);
		const json_response2 = await response2.json();
		requestSenderInput.value = "ID: "+ json_response2.id + ", username: " + json_response2.username;
	});
	
	var allowRegistrationButton = document.getElementById("activate_library");
	var denyLibraryRegistrationButton = document.getElementById("reject_library_activation");
	
	async function processRequest(allow)
	{	
		// delete the request
		var tempURL = URLprefix + "requests/" + globalTempVariable2.id;
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
	});
}

library_activations_panel_activation();
