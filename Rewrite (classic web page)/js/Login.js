async function user_login(response_object)
{
	if(!response_object.ok)
	{
		alert("Prijava neuspješna");
		return;
	}
	
	
	const json_response = await response_object.json();

	//ownID = json_response.id;
	//ownUsername = json_response.username;
	
	localStorage.setItem("ownID", json_response.id);
	localStorage.setItem("ownUsername", json_response.username);
	
	console.log("set id: " + localStorage.getItem("ownID"));
	console.log("set username: " + localStorage.getItem("ownUsername"));
	
	if(json_response.isAdministrator == true)
	{
		window.location = "Administrator.html";
		alert("Did");
		return;
	}
	else if(json_response.isSupervisor == true)
	{
		window.location = "Supervisor.html";
		return;
	}	
}


const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", async function(event)
{
	event.preventDefault();
	
	const formData = new FormData(this);
	const formData_JSON = FormData_to_JSON(formData);
	
	//make_request(URL, method, headers, body_content)
	const URL = URLprefix + "administrative-users/login";
	const response = await make_request(URL, "POST", JSON_headers, formData_JSON);
	//const json_response = await response.json();
	user_login(response);
});

const registerButton = document.getElementById("register_button");
registerButton.addEventListener("click", function()
{
	window.location = "Registration.html";
})