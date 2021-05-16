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
	activate_template(panel_children, "library_activations_template");
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
	activate_template(panel_children, "library_overview");
}

function postavke_click()
{
	panel_header_name.innerHTML = "Postavke";
	remove_panel_elements();
	
	// to do	
	activate_template(panel_children, "supervisor_settings_template");
}

function login()
{
	
	
}

function addEventToClass(classElements, callback)
{
	for(var i = 0; i < classElements.length; i++)
		classElements[i].addEventListener("click", callback);
}

function admin_registracija_citaonica_click()
{
	panel_header_name.innerHTML = "Registracija čitaonica";
	remove_panel_elements();
	
	//to do
}

function supervisor_pregled_citaonica_click()
{
	panel_header_name.innerHTML = "Pregled čitaonica";
	remove_panel_elements();
	
	activate_template(panel_children, "supervisor_library_overview");
}

function admin_pregled_citaonica_click()
{
	panel_header_name.innerHTML = "Pregled čitaonica";
	remove_panel_elements();
	
	activate_template(panel_children, "admin_library_overview");
	
}

function admin_obavjestenja_click()
{
	panel_header_name.innerHTML = "Obavještenja";
	remove_panel_elements();
	
	activate_template(panel_children, "admin_library_notifications_panel");
}

function supervisor_init()
{
	// activate templates
	activate_template(document.getElementById("navigation"), "supervisor_sidenav");
	activate_template(navigation_list, "supervisor_navigation_list");
	
	var obrada_zahtjeva = document.querySelectorAll(".obrada_zahtjeva_btn");
	var pregled_administratora = document.querySelectorAll(".pregled_administratora_btn");
	var pregled_citaonica = document.querySelectorAll(".pregled_citaonica_btn");
	var postavke = document.querySelectorAll(".postavke_btn");
	
	addEventToClass(obrada_zahtjeva, supervisor_obrada_zahtjeva_click);
	addEventToClass(pregled_administratora, pregled_administratora_click);
	addEventToClass(pregled_citaonica, supervisor_pregled_citaonica_click);
	addEventToClass(postavke, postavke_click);
	
	/*document.getElementsByClassName("obrada_zahtjeva_btn").addEventListener("click", supervisor_obrada_zahtjeva_click);
	document.getElementsByClassName("pregled_administratora_btn").addEventListener("click", pregled_administratora_click);
	document.getElementsByClassName("pregled_citaonica_btn").addEventListener("click", pregled_citaonica_click);
	document.getElementsByClassName("postavke_btn").addEventListener("click", postavke_click);*/
}

function admin_init()
{
	// activate templates
	activate_template(document.getElementById("navigation"), "admin_sidenav");
	activate_template(navigation_list, "admin_navigation_list");

	
	// to do (add callbacks to buttons for admins)
	var registracija_citaonice = document.querySelectorAll(".registracija_citaonice");
	var pregled_citaonica = document.querySelectorAll(".admin_pregled_citaonica");
	var admin_obavjestenja = document.querySelectorAll(".admin_obavjestenja");
	var postavke = document.querySelectorAll(".admin_postavke_btn");
	
	addEventToClass(registracija_citaonice, admin_registracija_citaonica_click);
	addEventToClass(pregled_citaonica, admin_pregled_citaonica_click);
	addEventToClass(admin_obavjestenja, admin_obavjestenja_click);
	addEventToClass(postavke, postavke_click);
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
	var user_type="admin"; // obtain from cookie
	
	
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

function openNavSupervisor() 
{
  document.getElementById("supervisor_sidenav_div").style.width = "250px";
  document.body.style.marginRight = "250px";
}

function closeNavSupervisor()
{
	document.getElementById("supervisor_sidenav_div").style.width = "0";
	document.body.style.marginRight= "0";
}

function openNavAdmin()
{
  document.getElementById("admin_sidenav_div").style.width = "250px";
  document.body.style.marginRight = "250px";
}

function closeNavAdmin()
{
	document.getElementById("admin_sidenav_div").style.width = "0";
	document.body.style.marginRight= "0";
	
}

var admin = "admin";
var supervisor = "supervisor";

var navigation_list = document.getElementById("navigation_list");
var panel = document.getElementById("panel");
var panel_children = document.getElementById("panel_content");
var panel_header_name = document.getElementById("panel_header_name");

init();
//activate_template(panel_children, "supervisor_settings_template");
//activate_template(panel_children, "library_overview");
//activate_template(panel_children, "supervisor_admin_overview");
//activate_template(panel_children, "library_activations_template");

//https://www.html5rocks.com/en/tutorials/webcomponents/template/
//https://www.youtube.com/watch?v=mfN-EOkj13Q