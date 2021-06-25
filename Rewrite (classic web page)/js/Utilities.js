const URLprefix = "https://ps-projektni-lectorio.oa.r.appspot.com/api/v1/";
const reading_room_registration_form_ID = "library_registration_form";

const validateTimeRegexPattern = "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"; // format HH:mm
const validateTimeRegex = new RegExp(validateTimeRegexPattern);

var globalTempVariable = null;
var globalTempVariable2 = null;
var globalTempVariable3 = null;
var globalTempVariable4 = null;


const ownID = localStorage.getItem("ownID");
const ownUsername = localStorage.getItem("ownUsername");

console.log("my id: " + ownID);
console.log("my username: " + ownUsername);

var admin = "admin";
var supervisor = "supervisor";

const JSON_headers = 
{
	"Content-Type": "application/json",
	"Accept": "application/json"
};

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


var empty_cell = "_";
var standard_seat = "S";
var socket_seat = "P";
var table = "T";
var door = "D";


var colorMap = {};
colorMap[empty_cell] = "white";
colorMap[standard_seat] = "orange";
colorMap[socket_seat] = "blue";
colorMap[table] = "brown";
colorMap[door] = "black";

var latitude = null;
var longitude = null;


var logout_button = document.getElementsByClassName("logout_btn");
console.log(logout_button.length);
if(logout_button.length == 1)
{
	console.log("is one");
	logout_button[0].addEventListener("click", function()
	{
		console.log("removing from local storage");
		localStorage.removeItem("ownID"); 
		localStorage.removeItem("ownUsername"); 
	});
}

async function getAdmin(adminID)
{
	var URL = URLprefix + "administrators/" + adminID;
	var answer = await make_request(URL, "GET", JSON_headers, null);
	var answer_JSON = await answer.json();
	return answer_JSON;
}

function FormData_to_JSON(formData_object)
{
	const plainFormData = Object.fromEntries(formData_object.entries());
	const formDataJSON = JSON.stringify(plainFormData);
	return formDataJSON;
}

// returns response as an object that should be converted to JSON
async function make_request(URL, method, headers, body_content)
{
	var response = await fetch(URL,
	{
		"method": method,
		"headers": headers,
		"body": body_content
	});
	
	//const json_response = await response.json();
	return response;
}

function make_activation_request(requestType, readingRoomID)
{
	var date = new Date();
	
	var request = {requestType: requestType,
				   supervisorId: "1",
				   readingRoomId: readingRoomID,
				   administratorId: ownID,
				   creationDateTime: date.toISOString()
				  };
	return request;
}

function addEventToClass(classElements, callback)
{
	for(var i = 0; i < classElements.length; i++)
		classElements[i].addEventListener("click", callback);
}

function canvas_setup()
{
	canvas_horizontal_slider = document.getElementById("canvas_num_of_verticall_lines");
	canvas_vertical_slider = document.getElementById("canvas_num_of_horizontal_lines");
	canvas_entrance_button_clicked();
	
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
	canvas_drawn_cells_array = new Array(num_of_horizontal_lines*num_of_vertical_lines);
	for(var i = 0; i < num_of_horizontal_lines*num_of_vertical_lines; i++)
		canvas_drawn_cells_array[i] = empty_cell;

	
	// drawLibrary(canvasContext, numOfHorizontalLines, numOfVerticalLines, layoutString)
	drawLibrary(canvas_context, num_of_horizontal_lines, num_of_vertical_lines, canvas_drawn_cells_array);
}

function drawLibrary(canvasContext, num_of_horizontal_lines, num_of_vertical_lines, layoutString)
{
	// canvas HTML element dimensions are separated from the canvas' context dimensions
	// these context dimensions have to be set to the dimensions of the HTML canvas element
	
	canvas_horizontal_slider.value = num_of_horizontal_lines;
	canvas_vertical_slider.value = num_of_vertical_lines;
	
	canvas_height = canvas_context.canvas.height = canvasH;
	canvas_width = canvas_context.canvas.width = canvasW;
		
	horizontal_step = canvas_width / num_of_vertical_lines;
	vertical_step = canvas_height / num_of_horizontal_lines;
		
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
	

	var layoutStringCounter = 0;
	
	var yCoord = 0;
	for(y = 0; y < num_of_horizontal_lines; y++)
	{
		var xCoord = 0;
		for(x = 0; x < num_of_vertical_lines; x++)
		{
			canvas_context.fillStyle = colorMap[layoutString[layoutStringCounter++]];
			canvas_context.fillRect(xCoord+1, yCoord+1, horizontal_step-2, vertical_step-2);
			
			xCoord += horizontal_step;
		}
		yCoord += vertical_step;
	}
	
    canvas_context.stroke();
}

function canvas_click_event(event)
{
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
	
	var selected_cell_x = Math.floor(x / horizontal_step);
	var selected_cell_y = Math.floor(y / vertical_step);
	
	var libraryHeight = canvas_horizontal_slider.value;
	var libraryWidth = canvas_vertical_slider.value;
	canvas_drawn_cells_array[selected_cell_y*libraryWidth + selected_cell_x] = canvas_string_representation_character;
	//canvas_drawn_cells_array[selected_cell_y][selected_cell_x] = canvas_string_representation_character;
	
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

function canvas_entrance_button_clicked()
{
	canvas_drawing_color = "black";
	canvas_string_representation_character = door;
}
function canvas_standard_seat_button_clicked()
{
	canvas_drawing_color = "orange";
	canvas_string_representation_character = standard_seat;
}
function canvas_socket_seat_button_clicked()
{
	canvas_drawing_color = "blue";
	canvas_string_representation_character = socket_seat;
}
function canvas_table_button_clicked()
{
	canvas_drawing_color = "brown";
	canvas_string_representation_character = table;
}
function canvas_reset_button_clicked()
{
	canvas_drawing_color = "white";
	canvas_string_representation_character = empty_cell;
}

function validateTimeFormat(timeString)
{
	// validates if the time is in HH:mm format
	return validateTimeRegex.test(timeString);
}

async function submit_reading_room_registration_data()
{
	event.preventDefault();
	
	
	
	const formData = new FormData(document.getElementById(reading_room_registration_form_ID));
	const formData_JSON_string = FormData_to_JSON(formData);
	

	const formData_JSON = JSON.parse(formData_JSON_string);
	if(validateTimeFormat(formData_JSON.openingTime) == false || validateTimeFormat(formData_JSON.closingTime) == false)
	{
		alert("Unesite vrijeme u formatu HH:mm");
		return;
	}
	
	
	var libraryHeight = canvas_horizontal_slider.value;
	var libraryWidth = canvas_vertical_slider.value;
	formData_JSON.xSize = libraryWidth;
	formData_JSON.ySize = libraryHeight;
	
	if(latitude == null || longitude == null)
	{
		alert("Odaberite lokaciju.");
		return;
	}
	
	formData_JSON.latitude = latitude;
	formData_JSON.longitude = longitude;
	
	
	// convert array to a string
	var tmpString = canvas_drawn_cells_array.join("");
	formData_JSON.insideAppearance = tmpString;
	//formData_JSON.active = "true";
	
	formData_JSON.images = formData_JSON.images.split(",");
	for(var i = 0; i < formData_JSON.images.length; i++)
		formData_JSON.images[i] = formData_JSON.images[i].trimStart();
	
	
	console.log(JSON.stringify(formData_JSON));
	
	// create a reading room
	const URL = URLprefix + "reading-rooms";
	const response = await make_request(URL, "POST", JSON_headers, JSON.stringify(formData_JSON));
	const json_response = await response.json();
	
	if(!response.ok)
	{
		alert("Registracija čitaonice neuspješna");
		return;
	}
	
	// make a reading room registration request...
	const newRequestURL = URLprefix + "requests";
	const requestJSON = make_activation_request("readingRoomActivationRequest", json_response.id);
	requestJSON.administratorId = ownID

	var response2 = await make_request(newRequestURL, "POST", JSON_headers, JSON.stringify(requestJSON));

	if(!response2.ok)
	{
		alert("Registracija čitaonice neuspješna");
		return;
	}
	
	response2 = await response2.json();
	
	
	
	// assign the reading room to the administrator...
	var URL2 = URLprefix + "reading-rooms/" + json_response.id + "/administrators";
	var reqBody = {"username" : ownUsername};
	
	var response3 = await make_request(URL2, "POST", JSON_headers, JSON.stringify(reqBody));
	
	if(!response3.ok)
	{
		alert("Registracija čitaonice neuspješna");
		return;
	}		

	alert("Registracija čitaonice uspješna");

}
