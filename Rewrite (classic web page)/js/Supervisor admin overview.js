async function pregled_administratora_click()
{
	// populate the select with admins
	var URL1 = URLprefix + "administrators";
	const answer = await make_request(URL1, "GET", JSON_headers, null);
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
		var URL = URLprefix + "administrators/" + globalTempVariable2.id + "/reading-rooms";
		var response = await make_request(URL, "GET", JSON_headers, null);
		globalTempVariable3 = await response.json();
		
		// populate the listview of reading rooms
		var selectElement = document.getElementById("admin_overview_library_list");
		selectElement.innerHTML = "";
		selectElement.innerHTML += '<option selected style="display:none;">' + "Čitaonice u vlasništvu" + '</option>';
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
		var adminDeactivationURL = URLprefix + "administrators/" + globalTempVariable2.id;
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

pregled_administratora_click();
