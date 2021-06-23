async function supervisor_pregled_citaonica_click()
{
	// globalTempVariable holds all the reading rooms (as JSON array)
	// globalTempVariable2 holds the selected reading room
	
	var URL1 = URLprefix + "reading-rooms";
	globalTempVariable = await make_request(URL1, "GET", JSON_headers, null);
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
		var URL = URLprefix + "reading-rooms/" + globalTempVariable2.id + "/administrators";
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
		var URL = URLprefix + "reading-rooms/" + globalTempVariable2.id;
		globalTempVariable2.active = false;
		await make_request(URL, "PUT", JSON_headers, JSON.stringify(globalTempVariable2));
	});
}

supervisor_pregled_citaonica_click();