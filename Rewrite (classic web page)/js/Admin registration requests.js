async function admin_requests_panel_activation()
{
	// globalTempVariable holds all the requests
	// globalTempVariable2 holds the selected request
	
	// get all requests
	//make_request(URL, method, headers, body_content)
	var URL1 = URLprefix + "requests";
	const answer = await make_request(URL1, "GET", JSON_headers, null);
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
		
		const URL2 = URLprefix + "administrators/" + selectedRequest.administratorId;
		var response = await make_request(URL2, "GET", JSON_headers, null);
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
		if(globalTempVariable2 == null)
		{
			alert("Prvo odaberite zahtjev");
			return;
		}
		
		// set the status
		globalTempVariable2.approved = allow;
		var URL3 = URLprefix + "requests/" + globalTempVariable2.id;
		var response = await make_request(URL3, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
		if(response.ok == false)
		{
			alert("Greška");
			return;
		}
		// now actually activate the admin...
		var adminJSON = await getAdmin(globalTempVariable2.administratorId);
		adminJSON.activated = allow;
		var URL4 = URLprefix + "administrators/" + adminJSON.id;
		var response = await make_request(URL4, "PUT", JSON_headers, JSON.stringify(adminJSON));
		if(response.ok == false)
		{
			alert("Greška");
			return;
		}
		
		// delete the request
		var tempURL = URLprefix + "requests/" + globalTempVariable2.id;
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
		globalTempVariable2 = null;
	}
	
	allowRegistrationButton.addEventListener("click", async function()
	{
		processRequest(true);
	});
	
	denyAdminRegistrationButton.addEventListener("click", async function()
	{
		processRequest(false);
	});
}

admin_requests_panel_activation();
