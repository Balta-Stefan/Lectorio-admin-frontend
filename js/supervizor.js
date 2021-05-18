/* 
	appendChild only moves a node.
	When using templates, this means that removing an instance of the template will remove it permanently
	so that the template will be gone forever.
	That's why it must be cloned (there seem to be 2 methods, importNode and cloneNode)
	
	Canvas:
	-canvas_context.beginPath(); has to be called before each drawing.The reason for this is that everything that was drawn will be redrawn for each new stroke()
	 and all the items will keep getting darker because the colors accumulate
	
	//https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
	
	
	
	Library layout color character meanings:
		canvas_string_representation_character - stores obe of the chars below
		
		D - vrata (door)
		T - sto (table)
		_ - prazno
		P - mjesto s uticnicom
		S - standardno mjesto
	
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
	
	activate_template(panel_children, "admin_library_registration");
	
	var canvas_area = document.getElementById("admin_library_registration_canvas_wrapper");
	activate_template(canvas_area, "library_layout_drawing_template");
	
	canvas_setup();
	canvas_draw_lines();
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
	
	
	var canvas_area = document.getElementById("admin_library_layout_picture_container");
	activate_template(canvas_area, "library_layout_drawing_template");

	// draw on the canvas
	canvas_setup();
	canvas_draw_lines();
	
	// register the submit button event
	//document.getElementById("library_registration_submit_button").onclick = register_library;
}


function canvas_entrance_button_clicked()
{
	canvas_drawing_color = "black";
	canvas_string_representation_character = 'D';
}
function canvas_standard_seat_button_clicked()
{
	canvas_drawing_color = "orange";
	canvas_string_representation_character = 'S';
}
function canvas_socket_seat_button_clicked()
{
	canvas_drawing_color = "blue";
	canvas_string_representation_character = 'P';
}
function canvas_table_button_clicked()
{
	canvas_drawing_color = "brown";
	canvas_string_representation_character = 'T';
}
function canvas_reset_button_clicked()
{
	canvas_drawing_color = "white";
	canvas_string_representation_character = '_';
}

function canvas_click_event(event)
{
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
	
	var selected_cell_x = Math.floor(x / horizontal_step);
	var selected_cell_y = Math.floor(y / vertical_step);
	
	canvas_drawn_cells_array[selected_cell_y][selected_cell_x] = canvas_string_representation_character;
	
	var drawX = selected_cell_x * horizontal_step;
	var drawY = selected_cell_y * vertical_step;
	//alert(selected_cell_x);
	//alert(selected_cell_y);
	
	// offsets in fillRect are there because white color will remove borders
	canvas_context.beginPath();
	canvas_context.fillStyle = canvas_drawing_color;
	canvas_context.fillRect(drawX+1, drawY+1, horizontal_step-2, vertical_step-2);
	canvas_context.stroke();
}

function canvas_setup()
{
	canvas_horizontal_slider = document.getElementById("canvas_num_of_verticall_lines");
	canvas_vertical_slider = document.getElementById("canvas_num_of_horizontal_lines");
	
	var slider_class = document.querySelectorAll(".canvas_slider");
	addEventToClass(slider_class, canvas_draw_lines);
	
	canvas = document.getElementById("drawing_canvas");
	canvas.addEventListener('click', canvas_click_event);
	canvas_context = canvas.getContext("2d");
	canvas_context.lineWidth = 1;
	
	canvasW = document.getElementById('drawing_canvas').offsetWidth;
	canvasH = document.getElementById('drawing_canvas').offsetHeight;
	
	// prepare the button events
	document.getElementById("canvas_entry").onclick = canvas_entrance_button_clicked;
	document.getElementById("canvas_standard_seat").onclick = canvas_standard_seat_button_clicked;
	document.getElementById("canvas_socket_seat").onclick = canvas_socket_seat_button_clicked;
	document.getElementById("canvas_table").onclick = canvas_table_button_clicked;
	document.getElementById("canvas_remove_elements").onclick = canvas_reset_button_clicked;
}

function canvas_draw_lines()
{
	var num_of_horizontal_lines = canvas_horizontal_slider.value;
	var num_of_vertical_lines = canvas_vertical_slider.value;
	
	// allocate a 2D array that will hold cell values
	canvas_drawn_cells_array = new Array(num_of_horizontal_lines);
	
	for(var i = 0; i < num_of_horizontal_lines; i++)
	{
		canvas_drawn_cells_array[i] = new Array(num_of_vertical_lines);
		for(var j = 0; j < num_of_vertical_lines; j++)
			canvas_drawn_cells_array[i][j] = '-';
	}
	

	// canvas HTML element dimensions are separated from the canvas' context dimensions
	// these context dimensions have to be set to the dimensions of the HTML canvas element
	canvas_height = canvas_context.canvas.height = canvasH;
	canvas_width = canvas_context.canvas.width = canvasW;
	
	
	horizontal_step = canvas_width / num_of_horizontal_lines;
	vertical_step = canvas_height / num_of_vertical_lines;
		
	canvas_context.beginPath();
	for(x = horizontal_step; x <= canvas_width; x += horizontal_step)
	{
		canvas_context.moveTo(x, 0);
		canvas_context.lineTo(x, canvas_height);
	}
	for(y = vertical_step; y <= canvas_height; y += vertical_step)
	{
		canvas_context.moveTo(0, y);
		canvas_context.lineTo(canvas_width, y);
	}
	
    canvas_context.stroke();
}

// callback to register button on the library registration panel
function register_library()
{
	var form_element = document.getElementById("library_registration_form");
	var form_data = new FormData(form_element);
	
	/*
	    "name": "Čitaonica elektrotehničkog fakulteta u Banjoj Luci",
		"address": "Banja Luka, Patre 5",
		"active": "true",
		"latitude": "44.76669385601328",
		"longitude": "17.18698250432791",
		"xSize": "3",
		"ySize": "3",
		"insideAppearance": "AAATTTAAA"
	
	
	*/
	/*for(var key of form_data.keys())
		console.log(key);
	
	for(var value of form_data.values())
		console.log(value);*/
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

var canvas = null;
var canvas_context = null;
var canvas_horizontal_slider = null;
var canvas_vertical_slider = null;
var canvasW = 0;
var canvasH = 0;
var canvas_drawing_color = "black";
var canvas_height = null;
var canvas_width = null;
var horizontal_step = null;
var vertical_step = null;
var canvas_drawn_cells_array = null;
var canvas_string_representation_character = null;

//https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript

init();
//activate_template(panel_children, "supervisor_settings_template");
//activate_template(panel_children, "library_overview");
//activate_template(panel_children, "supervisor_admin_overview");
//activate_template(panel_children, "library_activations_template");

//https://www.html5rocks.com/en/tutorials/webcomponents/template/
//https://www.youtube.com/watch?v=mfN-EOkj13Q