function remove_panel_elements()
{
	while(panel_children.firstChild)
		panel_children.firstChild.remove();
}

function obrada_zahtjeva_utility(button)
{
	button.innerHTML = "Zahtjevi za registraciju administratorskih naloga";
	panel_children.appendChild(button);
	button.className = "button";
}

function obrada_zahtjeva_click()
{
	panel_header_name.innerHTML = "Obrada zahtjeva";
	
	remove_panel_elements();
	
	var admin_requests = document.createElement("BUTTON");
	var library_requests = document.createElement("BUTTON");
	var library_activations = document.createElement("BUTTON");
	
	obrada_zahtjeva_utility(admin_requests);
	obrada_zahtjeva_utility(library_requests);
	obrada_zahtjeva_utility(library_activations);
}

function pregled_administratora_click()
{
	panel_header_name.innerHTML = "Pregled administratora";
	remove_panel_elements();
	
	// to do
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

document.getElementById("obrada_zahtjeva_btn").addEventListener("click", obrada_zahtjeva_click);
document.getElementById("pregled_administratora_btn").addEventListener("click", pregled_administratora_click);
document.getElementById("pregled_citaonica_btn").addEventListener("click", pregled_citaonica_click);
document.getElementById("postavke_btn").addEventListener("click", postavke_click);



var panel_children = document.getElementById("panel_content");
var panel_header_name = document.getElementById("panel_header_name");