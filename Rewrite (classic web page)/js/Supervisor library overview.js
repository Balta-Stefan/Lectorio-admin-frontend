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
	
	console.log(globalTempVariable);
	
	// populate the reading room select
	var selectElement = document.getElementById("admin_list_of_libraries");
	for(var i = 0; i < globalTempVariable.length; i++)
		selectElement.innerHTML = selectElement.innerHTML + '<option value="' + globalTempVariable[i].id + '">' + "ID čitaonice: " + globalTempVariable[i].id + ", Ime: " + globalTempVariable[i].name + '</option>';
		
	selectElement.addEventListener("change", async function(event)
	{
		var selectedReadingroomID = event.target.value;
		globalTempVariable2 = globalTempVariable.find(toFind => toFind.id == selectedReadingroomID);
		console.log(globalTempVariable2);
		// populate the input elements
		var latitude_input = document.getElementById("latitude_input");
		var longitude_input = document.getElementById("longitude_input");
		var address_input = document.getElementById("address_input");
		var name_input = document.getElementById("name_input");
		var thumbnail_input = document.getElementById("thumbnail_input");
		var other_images_input = document.getElementById("other_images_input");
		var number_of_seats_input = document.getElementById("number_of_seats_input");
		var reading_room_type = document.getElementById("type_of_reading_room");
		
		
		var reading_room_thumbnail = document.getElementById("admin_library_picture");
		reading_room_thumbnail.src = globalTempVariable2.readingRoomListImage;
		
		reading_room_type.value = globalTempVariable2.readingRoomType;
		latitude_input.value = globalTempVariable2.latitude;
		longitude_input.value = globalTempVariable2.longitude;
		address_input.value = globalTempVariable2.address;
		name_input.value = globalTempVariable2.name;
		thumbnail_input.value = globalTempVariable2.readingRoomListImage;
		other_images_input.value = globalTempVariable2.images;
		number_of_seats_input.value = globalTempVariable2.numberOfSeats;
		
		
		// populate the administrators list
		//var addressInput = document.getElementById("admin_library_address");
		var URL = URLprefix + "reading-rooms/" + globalTempVariable2.id + "/administrators";
		console.log(URL);
		var listOfAdminsRequest = await make_request(URL, "GET", JSON_headers, null);
		var listOfAdmins = await listOfAdminsRequest.json();
		console.log(listOfAdmins);
		var adminsSelect = document.getElementById("admin_library_administrators");
		
		
		for(var i = 0; i < listOfAdmins.length; i++)
		{
			adminsSelect.innerHTML += "<option>" + "ID: " + listOfAdmins[i].id + ", Ime: " + listOfAdmins[i].username + "</option>"
		}
		//addressInput.value = globalTempVariable2.address;
		
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