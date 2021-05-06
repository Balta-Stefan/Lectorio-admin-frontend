/* 
	appendChild only moves a node.
	When using templates, this means that removing an instance of the template will remove it permanently
	so that the template will be gone forever.
	That's why it must be cloned (there seem to be 2 methods, importNode and cloneNode)
*/

function remove_panel_elements()
{
	while(panel_children.firstChild)
		panel_children.firstChild.remove();
}


function supervisor_obrada_zahtjeva_click()
{
	panel_header_name.innerHTML = "Obrada zahtjeva";
	
	remove_panel_elements();
	
	var supervisor_requests_template = document.getElementById("supervisor_requests");
	requests_panel = document.importNode(supervisor_requests_template.content, true);
	panel_children.appendChild(requests_panel);
}

function pregled_administratora_click()
{
	panel_header_name.innerHTML = "Pregled administratora";
	remove_panel_elements();
	
	// to do
	var admin_overview = document.getElementById("supervisor_admin_overview");
	var clone = document.importNode(admin_overview.content, true);
	panel_children.appendChild(clone);
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
	var supervisor_navigation_template = document.getElementById("supervisor_navigation_list");
	var clone = document.importNode(supervisor_navigation_template.content, true);
	navigation_list.appendChild(clone);
	
	document.getElementById("obrada_zahtjeva_btn").addEventListener("click", supervisor_obrada_zahtjeva_click);
	document.getElementById("pregled_administratora_btn").addEventListener("click", pregled_administratora_click);
	document.getElementById("pregled_citaonica_btn").addEventListener("click", pregled_citaonica_click);
	document.getElementById("postavke_btn").addEventListener("click", postavke_click);
}

function admin_init()
{
	// activate templates
	var admin_navigation_template = document.getElementById("admin_navigation_list");
	var clone = document.importNode(admin_navigation_template.content, true);
	navigation_list.appendChild(clone);
	
	// to do (add callbacks to buttons for admins)
	
}

function registration_loginPanel_click()
{
	remove_panel_elements();
	
	var registration_panel_template = document.getElementById("register_panel");
	var clone = document.importNode(registration_panel_template.content, true);
	panel_children.appendChild(clone);
}

function init()
{
	// check if a valid cookie is present
	// to do
	var cookieValid = new Boolean(false);
	var user_type; // obtain from cookie
	
	
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
	var login_panel = document.getElementById("login_panel");
	var clone = document.importNode(login_panel.content, true);
	panel_children.appendChild(clone);
	
	document.getElementById("register_button").addEventListener("click", registration_loginPanel_click);
}

var admin = "admin";
var supervisor = "supervisor";

var navigation_list = document.getElementById("navigation_list");
var panel = document.getElementById("panel");
var panel_children = document.getElementById("panel_content");
var panel_header_name = document.getElementById("panel_header_name");

init();


//https://www.html5rocks.com/en/tutorials/webcomponents/template/
//https://www.youtube.com/watch?v=mfN-EOkj13Q