/* 
	appendChild only moves a node.
	When using templates, this means that removing an instance of the template will remove it permanently
	so that the template will be gone forever.
	That's why it must be cloned (there seem to be 2 methods, importNode and cloneNode)
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

function admin_requests_panel_activation()
{
	remove_panel_elements();
	activate_template(panel_children, "admin_registration_requests");
	panel_header_name.innerHTML = "Pregled zahtjeva za registraciju administratora"
}

function library_activations_panel_activation()
{
	remove_panel_elements();
	panel_header_name.innerHTML = "Aktivacije čitaonica";
	// to do
}

function supervisor_obrada_zahtjeva_click()
{
	panel_header_name.innerHTML = "Obrada zahtjeva";
	
	remove_panel_elements();
	
	activate_template(panel_children, "supervisor_requests");
	
	document.getElementById("admin_registration_requests_btn").addEventListener("click", admin_requests_panel_activation);
	document.getElementById("library_activation_requests_btn").addEventListener("click", library_activations_panel_activation);
}

function pregled_administratora_click()
{
	panel_header_name.innerHTML = "Pregled administratora";
	remove_panel_elements();
	
	// to do
	activate_template(panel_children, "supervisor_admin_overview");
}

function pregled_citaonica_click()
{
	panel_header_name.innerHTML = "Pregled čitaonica";
	remove_panel_elements();
	
	// to do
}

function postavke_click()
{
	panel_header_name.innerHTML = "Postavke";
	remove_panel_elements();
	
	// to do	
}

function login()
{
	
	
}

function supervisor_init()
{
	// activate templates
	activate_template(navigation_list, "supervisor_navigation_list");
	
	document.getElementById("obrada_zahtjeva_btn").addEventListener("click", supervisor_obrada_zahtjeva_click);
	document.getElementById("pregled_administratora_btn").addEventListener("click", pregled_administratora_click);
	document.getElementById("pregled_citaonica_btn").addEventListener("click", pregled_citaonica_click);
	document.getElementById("postavke_btn").addEventListener("click", postavke_click);
}

function admin_init()
{
	// activate templates
	activate_template(navigation_list, "admin_navigation_list");

	
	// to do (add callbacks to buttons for admins)
	
}

function registration_loginPanel_click()
{
	remove_panel_elements();
	
	activate_template(panel_children, "register_panel");
}

function init()
{
	// check if a valid cookie is present
	// to do
	var cookieValid = new Boolean(false);
	var user_type="supervisor"; // obtain from cookie
	
	
	if(user_type === admin)
	{
		admin_init();
		document.title = "Administratorski panel"
		return;
	}
	else if(user_type === supervisor)
	{
		supervisor_init();
		document.title = "Supervizorski panel"
		return;
	}
	
	// show the login panel
	panel_header_name.innerHTML = "Prijava";
	document.title = "Prijava na sistem";
	
	activate_template(panel_children, "login_panel");
	
	document.getElementById("register_button").addEventListener("click", registration_loginPanel_click);
}

var admin = "admin";
var supervisor = "supervisor";

var navigation_list = document.getElementById("navigation_list");
var panel = document.getElementById("panel");
var panel_children = document.getElementById("panel_content");
var panel_header_name = document.getElementById("panel_header_name");

init();
//activate_template(panel_children, "admin_registration_requests");

//https://www.html5rocks.com/en/tutorials/webcomponents/template/
//https://www.youtube.com/watch?v=mfN-EOkj13Q