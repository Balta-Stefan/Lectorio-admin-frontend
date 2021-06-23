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
	const URL = URLprefix + "administrators";
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
	
	const newRequestURL = URLprefix + "requests";
	const requestJSON = make_activation_request("administratorRegistrationRequest", null);
	requestJSON.administratorId = assignedID
	const response2 = await make_request(newRequestURL, method, JSON_headers, JSON.stringify(requestJSON));
});