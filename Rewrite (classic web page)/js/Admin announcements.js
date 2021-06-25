async function admin_obavjestenja_click()
{
	// globalTempVariable holds all the reading rooms of the administrator
	// globalTempVariable2 holds all the announcements of a library
	// globalTempVariable3 holds the currently selected library
	// globalTempVariable4 holds the currently selected announcement
	
	// an empty announcement with ID = -1 is used to create a new announcement
	
	globalTempVariable3 = null;
	globalTempVariable4 = null;
		
	// get the list of own all reading rooms
	
	const URL = URLprefix + "administrators/" + ownID + "/reading-rooms";
	const response = await make_request(URL, "GET", JSON_headers, null);
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
		var tmpURL = URLprefix + "reading-rooms/" + selectedLibraryID + "/announcements";
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
			announcementsSelect.innerHTML += '<option ID="' + globalTempVariable2[i].id + '-option' + '"value="' + globalTempVariable2[i].id + '">' + "ID: " + globalTempVariable2[i].id + ", Naslov: " + globalTempVariable2[i].title + '</option>';
		}
	});
	
	announcementsSelect.addEventListener("change", async function(event)
	{
		if(globalTempVariable3 == null)		
			return;
		

		var selectedAnnouncementID = event.target.value;
		var textarea = document.getElementById("admin_notification_textarea");
		var title = document.getElementById("announcement_title_input");
		
		if(selectedAnnouncementID == -1) 
		{
			// chosen add new announcement option
			globalTempVariable4 = null;
			textarea.value = "";
			title.value = "";
			return;
		}
		globalTempVariable4 = globalTempVariable2.find(toFind => toFind.id == selectedAnnouncementID);
		
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
		var tmpUrl = URLprefix + "announcements";
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
		var tmpURL = URLprefix + "announcements/" + globalTempVariable4.id;
		var response = await make_request(tmpURL, "DELETE", JSON_headers, null);
		if(response.ok == false)
			alert("Brisanje neuspješno");
		else 
		{
			// remove the item from select and clear the title and text area
			var textarea = document.getElementById("admin_notification_textarea");
			var title = document.getElementById("announcement_title_input");
			
			textarea.value = "";
			title.value = "";
			
			var optionToRemove = document.getElementById(globalTempVariable4.id + '-option');
			optionToRemove.parentNode.removeChild(optionToRemove);
			
			globalTempVariable4 = null;
			
			alert("Brisanje uspješno");
		}
		
	});
}

admin_obavjestenja_click();