var root_url = "http://comp426.cs.unc.edu:3001/";
var airports = null;

//0. flight id, 1. departure id, 2. arrival id, 3. airline id, 4. departure time, 5. arrival time
var flights_array = [];

//0. airline ID, 1. airline name
var airlines_array = [];

//0. id, 1. name, 2. code, 3. latitude, 4.longtitude, 5.city
var airports_array = [];

//0. id, 1.name
var planes_array = []

//0. id, 1. row, 2.number 
var seats_array = []

var starting_location = "Sitterson Hall, Chapel Hill, NC";
var random_array = [];

//0. id, 1.dname, 2.dcode, 3.dcity, 4.aname, 5.acode, 6.acity, 7.time, 8
var search_array = []

$(document).ready(() => {
	let verify = false;

    $('#login_btn').on('click', () => {
	
	let user = verify ? "yuanming" : $('#login_user').val();
	let pass = verify ? "730070365" : $('#login_pass').val();
	
	
	$.ajax(root_url + 'sessions',
	       {
		   type: 'POST',
		   xhrFields: {withCredentials: true},
		   data: {
			user: {
		       username: user,
		       password: pass
		   },
		},
		   success: () => {
		     console.log("success");
               build_air_interface();
		   },
		   error: () => {
		       alert('Error!');
		   }
	       });
	});
});

var build_air_interface = function () {
    
    let body = $('body');
    body.empty();
    body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Explore your world. One flight at a time.</h2></div>');
    body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    body.append('<br>');
    
    $.ajax(root_url + 'flights', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;

/*                for(let a=0; a < qarray.length; a++) {
                    flights_array = new Array(4);
                }*/
                
                //console.log(qarray[1].id);
                for (let i=0; i<qarray.length; i++) {
                    flights_array[i] = [];
                    flights_array[i][0] = qarray[i].id;
                    flights_array[i][1] = qarray[i].departure_id;
                    flights_array[i][2] = qarray[i].arrival_id;
                    flights_array[i][3] = qarray[i].airline_id;
                    flights_array[i][4] = (qarray[i].departs_at).slice(11,16);
                    flights_array[i][5] = (qarray[i].arrives_at).slice(11,16);
                    flights_array[i][6] = qarray[i].plane_id;
                    flights_array[i][7] = qarray[i].number;
                }
                
        }
    });
    
    $.ajax(root_url + 'airlines', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;

                for (let i=0; i<qarray.length; i++) {
                    airlines_array[i] = [];
                    airlines_array[i][0] = parseInt(qarray[i].id);
                    airlines_array[i][1] = qarray[i].name;
                }
        }
    });
    
    $.ajax(root_url + 'airports', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;

                for (let i=0; i<qarray.length; i++) {
                    airports_array[i] = [];
                    airports_array[i][0] = parseInt(qarray[i].id);
                    airports_array[i][1] = qarray[i].name;
                    airports_array[i][2] = qarray[i].code;
                    airports_array[i][3] = qarray[i].latitude;
                    airports_array[i][4] = qarray[i].longitude;
                    airports_array[i][5] = qarray[i].city;
                }
                
        }
    });
    
    $.ajax(root_url + 'planes', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;

                for (let i=0; i<qarray.length; i++) {
                    planes_array[i] = [];
                    planes_array[i][0] = parseInt(qarray[i].id);
                    planes_array[i][1] = qarray[i].name;
                }
        }
    });
    
    body.append('<section class="selection_div" id="selection_div"><h2 class = "mainpage_headers">Find a flight!</h2>'
                + '<br><h3 style="margin-left:5%;" class = "mainpage_headers">Select Departure Airports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Select Date and Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Select an airline</h3></section><section class="selection_div2"></section>');
    $('.selection_div').append('<div class="aairport_selection"><select class="dropdown_airport"></select><button onclick="appendAirport()">Click to Check</button></div>');
    $('.selection_div').append('<div class="time_selection"><input class="airtime" type="datetime-local" name="bdaytime"></div>');
    $('.selection_div').append('<div class="airline_selection"></div>');
    $('.airline_selection').append('<input type="text" class="myInput" placeholder="Search for an airline.." title="Type in a name">&nbsp;&nbsp;<button onclick="appendAirline()">Click to see available airline</button>')
    $('.airline_selection').append('<ul class="myUL"></ul>');
    $('.selection_div2').append('<h3 style="margin-left:5%;" class = "mainpage_headers">Select Arrival Airports</h3>')
    $('.selection_div2').append('<div class="aairport_selection2"><select class="dropdown_airport2"></select><button onclick="appendAirport2()">Click to Check</button></div>');
    $('.selection_div2').append('<div class="search_flights"><button style="font-size:30px;" onclick="searchFlights()">Search Flights</button></div>')
    
    $(".myInput").keyup(function() {
       var string = $(this).val().toLowerCase().trim();
        $(".question-header").each(function() {
           if($(this).text().toLowerCase().trim().includes(string)) {
               $(this).parent().show();
           } else {
               $(this).parent().hide();
           }
        });
    });
        
};

function searchFlights() {
    //user input date
    var date = $('.airtime').val();
    
    //user input airline
    var airline = $('.myInput').val();
    
    //user input departure airport
    var dairport = parseInt($('.dropdown_airport option:selected').val());
    
    //user input arrival airport
    var aairport = parseInt($('.dropdown_airport2 option:selected').val());
        
    /*for(let i=0; i < flights_array.length; i++) {
        
    }*/
    
    if(dairport == aairport) {
        $('.search_flights').append('<p style="color:red;">The departure and arrival airports cannot be the same!</p>')
    }
    
    if(date == '' && airline == '') {
        let j = 0;
        for(let i=0; i < flights_array.length; i++) {
            if((dairport == flights_array[i][1]) && (aairport == flights_array[i][2])) {
                search_array[j] = [];
                //flight id
                search_array[j][0] = flights_array[i][0];
                //departure id
                search_array[j][1] = dairport;
                search_array[j][2] = findAirportName(dairport);
                search_array[j][3] = findAirportCode(dairport);
                search_array[j][4] = findAirportCity(dairport);
                //arrival id
                search_array[j][5] = aairport;
                search_array[j][6] = findAirportName(aairport);
                search_array[j][7] = findAirportCode(aairport);
                search_array[j][8] = findAirportCity(aairport);
                //airline id
                search_array[j][9] = flights_array[i][3];
                search_array[j][10] = findAirline(flights_array[i][3]);
                //departure time
                search_array[j][11] = flights_array[i][4];
                //arrival time
                search_array[j][12] = flights_array[i][5];
                //arrival airport coordinates
                search_array[j][13] = findAirportLat(aairport);
                search_array[j][14] = findAirportLong(aairport);
                //departure airport coordinates
                search_array[j][15] = findAirportLat(dairport);
                search_array[j][16] = findAirportLong(dairport);
                search_array[j][17] = findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport));
                //plane id
                search_array[j][18] = flights_array[i][6];
                search_array[j][19] = getPrice(findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport)), flights_array[i][4]);
                //number
                search_array[j][20] = flights_array[i][7];
                //plane type
                search_array[j][21] = findPlane(flights_array[i][6]);
            }
            j+1;
        }
    } else if(date == '') {
        let j = 0;
        for(let i=0; i < flights_array.length; i++) {
            if((dairport == flights_array[i][1]) && (aairport == flights_array[i][2]) && (findAirlineID(airline) == flights_array[i][3])) {
                search_array[j] = [];
                //flight id
                search_array[j][0] = flights_array[i][0];
                //departure id
                search_array[j][1] = dairport;
                search_array[j][2] = findAirportName(dairport);
                search_array[j][3] = findAirportCode(dairport);
                search_array[j][4] = findAirportCity(dairport);
                //arrival id
                search_array[j][5] = aairport;
                search_array[j][6] = findAirportName(aairport);
                search_array[j][7] = findAirportCode(aairport);
                search_array[j][8] = findAirportCity(aairport);
                //airline id
                search_array[j][9] = findAirlineID(airline);
                search_array[j][10] = airline;
                //departure time
                search_array[j][11] = flights_array[i][4];
                //arrival time
                search_array[j][12] = flights_array[i][5];
                //arrival airport coordinates
                search_array[j][13] = findAirportLat(aairport);
                search_array[j][14] = findAirportLong(aairport);
                //departure airport coordinates
                search_array[j][15] = findAirportLat(dairport);
                search_array[j][16] = findAirportLong(dairport);
                search_array[j][17] = findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport));
                search_array[j][18] = flights_array[i][6];
                search_array[j][19] = getPrice(findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport)), flights_array[i][4]);
                search_array[j][20] = flights_array[i][7];
                search_array[j][21] = findPlane(flights_array[i][6]);
            }
            j+1;
        }
    } else {
        let j = 0;
        for(let i=0; i < flights_array.length; i++) {
            if((dairport == flights_array[i][1]) && (aairport == flights_array[i][2]) && (findAirlineID(airline) == flights_array[i][3]) && (date == flights_array[i][4])) {
                search_array[j] = [];
                //flight id
                search_array[j][0] = flights_array[i][0];
                //departure id
                search_array[j][1] = dairport;
                search_array[j][2] = findAirportName(dairport);
                search_array[j][3] = findAirportCode(dairport);
                search_array[j][4] = findAirportCity(dairport);
                //arrival id
                search_array[j][5] = aairport;
                search_array[j][6] = findAirportName(aairport);
                search_array[j][7] = findAirportCode(aairport);
                search_array[j][8] = findAirportCity(aairport);
                //airline id
                search_array[j][9] = findAirlineID(airline);
                search_array[j][10] = airline;
                //departure time
                search_array[j][11] = date;
                //arrival time
                search_array[j][12] = flights_array[i][5];
                //arrival airport coordinates
                search_array[j][13] = findAirportLat(aairport);
                search_array[j][14] = findAirportLong(aairport);
                //departure airport coordinates
                search_array[j][15] = findAirportLat(dairport);
                search_array[j][16] = findAirportLong(dairport);
                search_array[j][17] = findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport));
                search_array[j][18] = flights_array[i][6];
                search_array[j][19] = getPrice(findDistance(findAirportLat(dairport), findAirportLong(dairport), findAirportLat(aairport), findAirportLong(aairport)), date);
                search_array[j][20] = flights_array[i][7];
                search_array[j][21] = findPlane(flights_array[i][6]);
            }
            j+1;
        }
    }
    
    let body = $('body');
    body.empty();
    
    body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Explore your world. One flight at a time.</h2></div>');
    body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    body.append('<br>');
    
    body.append('<div class="search_div" id="search_div"></div>');
    $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Search for Another Flight</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    
    if(search_array.length == 0) {
        $('#search_div').append('<br><br><br><h3 style="text-align:center;" class = "mainpage_headers">Your search produced zero results. Please search for another flight.</h3>');
    } else {
        $('#search_div').append('<br><br><br><h1 style="text-align:center;" class = "mainpage_headers">Here are your search results.</h1>');
    }
    
    for(let i = 0; i < search_array.length; i++) {
        $('#search_div').append('<div class="ser_div" id="popdiv_' + i + '"><br><p style="font-size: 17px;"><b>' + search_array[i][11] + '&nbsp;-&nbsp;' + search_array[i][12] + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + getDuration(search_array[i][11], search_array[i][12]) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$' + search_array[i][19] + '</p><p>' + search_array[i][10] + '&nbsp;(Plane: <b>#' + search_array[i][20] + '</b>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + search_array[i][2] + '&nbsp;(' + search_array[i][3] + ')&nbsp;' + ',&nbsp;' + search_array[i][4] + '&nbsp;----->&nbsp;' + search_array[i][6] + '&nbsp;(' + search_array[i][7] + ')&nbsp;' + ',&nbsp;' + search_array[i][8] + '</p><button onclick="searchBooking(' + i + ')">Book</button><br><br></div>');
        $('#search_div').append('<br>');
    }
    
}

function appendAirport() {
    for(let i=0; i < airports_array.length; i++) {
        $('.dropdown_airport').append('<option value = "' + airports_array[i][0] + '">' + airports_array[i][1] + '</option>');
    }
    //console.log(airports_array.length);
}

function appendAirport2() {
    for(let i=0; i < airports_array.length; i++) {
        $('.dropdown_airport2').append('<option value = "' + airports_array[i][0] + '">' + airports_array[i][1] + '</option>');
    }
    //console.log(airports_array.length);
}

function appendAirline() {
    for(let i=0; i < airlines_array.length; i++) {
        $('.myUL').append('<li><p class="question-header">' + airlines_array[i][1] + '</p></li>');
    }
}

function findPlane(id) {
    let aid = parseInt(id);
    for(let i = 0; i < planes_array.length; i++) {
        if(planes_array[i][0] == aid) {
            return planes_array[i][1];
        }
    }
}
    
function findAirportLat(id) {
    let aid = parseInt(id);
    for(let i = 0; i < airports_array.length; i++) {
        if(airports_array[i][0] == aid) {
            return airports_array[i][3];
        }
    }
}
    
function findAirportLong(id) {
    let aid = parseInt(id);
    for(let i = 0; i < airports_array.length; i++) {
        if(airports_array[i][0] == aid) {
            return airports_array[i][4];
        }
    }
}

function findAirlineID(str) {
    for(let i=0; i < airlines_array.length; i++) {
        if(airlines_array[i][1] == str) {
            return airlines_array[i][0];
        }
    }
}

function findAirportName(id) {
    //console.log(id);
    let aid = parseInt(id);
    for(let i = 0; i < airports_array.length; i++) {
        if(airports_array[i][0] == aid) {
            //console.log('Fuck yes');
            return airports_array[i][1];
        }
    }
}

function findAirportCode(id) {
    let aid = parseInt(id);
    for(let i = 0; i < airports_array.length; i++) {
        if(airports_array[i][0] == aid) {
            //console.log('Fuck yes');
            return airports_array[i][2];
        }
    }
}

function findAirportCity(id) {
    let aid = parseInt(id);
    for(let i = 0; i < airports_array.length; i++) {
        if(airports_array[i][0] == aid) {
            //console.log('Fuck yes');
            return airports_array[i][5];
        }
    }
}

function findAirline(id) {
    let aid = parseInt(id);
    for(let i=0; i < airlines_array.length; i++) {
        if(airlines_array[i][0] == aid) {
            return airlines_array[i][1];
        }
    }
}

function findSeat(id) {
    let aid = parseInt(id);
    for(let i=0; i < seats_array.length; i++) {
        if(seats_array[i][0] == aid) {
            return seats_array[i][1] + seats_array[i][2];
        }
    }
}

var rad = function(x) {
  return x * Math.PI / 180;
};

function findDistance(dlat, dlong, alat, along) {
    var R = 6378137;
    var dLat = rad(alat - dlat);
    var dlong = rad(along - dlong);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(rad(dlat)) * Math.cos(rad(alat)) *
        Math.sin(dlong / 2) * Math.sin(dlong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    var miles = d * 0.0006;
    return Math.round(miles * 100) / 100;
}

function findPopular() {
    
    let i = 0;
    let j = 0;
    
    while(i < flights_array.length) {
        
        random_array[j] = [];
        random_array[j][0] = flights_array[i][0];
        //departure id
        random_array[j][1] = flights_array[i][1];
        random_array[j][2] = findAirportName(flights_array[i][1]);
        random_array[j][3] = findAirportCode(flights_array[i][1]);
        random_array[j][4] = findAirportCity(flights_array[i][1]);
        //arrival id
        random_array[j][5] = flights_array[i][2];
        random_array[j][6] = findAirportName(flights_array[i][2]);
        random_array[j][7] = findAirportCode(flights_array[i][2]);
        random_array[j][8] = findAirportCity(flights_array[i][2]);
        //airline
        random_array[j][9] = flights_array[i][3];
        random_array[j][10] = findAirline(flights_array[i][3]);
        //departure time
        random_array[j][11] = flights_array[i][4];
        //arrival time
        random_array[j][12] = flights_array[i][5];
        //arrival airport coordinates
        random_array[j][13] = findAirportLat(flights_array[i][2]);
        random_array[j][14] = findAirportLong(flights_array[i][2]);
        //departure airport coordinates
        random_array[j][15] = findAirportLat(flights_array[i][1]);
        random_array[j][16] = findAirportLong(flights_array[i][1]);
        random_array[j][17] = findDistance(findAirportLat(flights_array[i][1]), findAirportLong(flights_array[i][1]), findAirportLat(flights_array[i][2]), findAirportLong(flights_array[i][2]));
        random_array[j][18] = flights_array[i][6];
        random_array[j][19] = getPrice(findDistance(findAirportLat(flights_array[i][1]), findAirportLong(flights_array[i][1]), findAirportLat(flights_array[i][2]), findAirportLong(flights_array[i][2])), flights_array[i][4]);
        random_array[j][20] = flights_array[i][7];
        random_array[j][21] = findPlane(flights_array[i][6]);
        
        i = i + Math.floor((Math.random() * 100) + 80);
        j = j+1;
    }
    
    let body = $('body');
    body.empty();
    
    body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Explore your world. One flight at a time.</h2></div>');
    body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    body.append('<br>');
    
    body.append('<div class="popular_div" id="popular_div"></div>');
    $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Go Back</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    
    $('#popular_div').append('<h1 class="mainpage_headers">Here is a list of commonly booked flights!</h1>');
    
    for(let b=0; b < random_array.length; b++) {
        $('#popular_div').append('<div class="pop_div" id="popdiv_' + b + '"><br><p style="font-size: 17px;"><b>' + random_array[b][11] + '&nbsp;-&nbsp;' + random_array[b][12] + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + getDuration(random_array[b][11], random_array[b][12]) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$' + random_array[b][19] + '</p><p>' + random_array[b][10] + '&nbsp;(Plane: <b>#' + random_array[b][20] + '</b>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + random_array[b][2] + '&nbsp;(' + random_array[b][3] + ')&nbsp;' + ',&nbsp;' + random_array[b][4] + '&nbsp;----->&nbsp;' + random_array[b][6] + '&nbsp;(' + random_array[b][7] + ')&nbsp;' + ',&nbsp;' + random_array[b][8] + '</p><button onclick="randomBooking(' + b + ')">Book</button><br><br></div>');
        $('#popular_div').append('<br>');
    }
    
}

function getPrice(distance, depart) {
    let d1 = 0;
    if(distance < 500) {
        d1 = 0.32;
    } else if(distance >= 500 && distance < 750) {
        d1 = 0.28;
    } else if(distance >= 750 && distance < 1000) {
        d1 = 0.24;
    } else if(distance >= 1000 && distance < 1500) {
        d1 = 0.20;
    } else if(distance >= 1500 && distance < 2000) {
        d1 = 0.17;
    } else {
        d1 = 0.13;
    }
    
    let d2 = 0;
    let index = depart.indexOf(":");
    let id = parseInt(depart.substr(0, index));
    
    if(id > 20) {
        d2 = 100;
    } else if(id < 20 && id >= 13) {
        d2 = 75;
    } else if(id < 13 && id >= 7) {
        d2 = 50;
    } else if(id < 7 && id >= 0) {
        d2 = 80;
    }
    
    let cost = (distance * d1 + d2 + Math.floor((Math.random() * 100) + 1)) * 0.7;
    return Math.floor(cost);
    //return cost;
}

function getDuration(depart, arrive) {
    let index = depart.indexOf(":"); 
    let id = parseInt(depart.substr(0, index)); 
    let text = parseInt(depart.substr(index + 1));
    let total1 = id*60 + text;
    
    let index2 = arrive.indexOf(":");
    let id2 = parseInt(arrive.substr(0, index2));
    let text2 = parseInt(arrive.substr(index2 + 1));
    let total2 = id2*60 + text2;
    
    if(id2 < id) {
        total2 = total2 + 1440;
    }
    
    let totaltime = total2 - total1;
    
    let hours = (Math.floor(totaltime/60)).toString();
    let minutes = (totaltime%60).toString();
    
    let duration = hours + 'h&nbsp;' + minutes + 'm'
    
    return duration
    
}

function searchBooking(i) {
    let body = $('body');
    body.empty();
    
    body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Only a click away from an amazing trip.</h2></div>');
    body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    body.append('<br>');
    
    body.append('<div class="itinerary_div" id="itinerary_div"></div>');
    body.append('<div class="itinerary_div2" id="itinerary_div2"></div>');
    $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Search for Another Flight</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    
    $('#itinerary_div').append('<h1 class="mainpage_headers">JLW Flights Information</h1>');
    $('#itinerary_div').append('<div class="iter_div" id="iter_div"><br><h3 style="margin-left:2%;" class="mainpage_headers">' + search_array[i][10] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#' + search_array[i][20] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$' + search_array[i][19] + '&nbsp;&nbsp;<button onclick="payNormalFlight(' + i + ')">Select</button></h3><br></div>');
    
    $('#itinerary_div').append('<div class="flight_info_div" id="flight_info_div"><br><div class="iter_div1" style="color: white;">' + search_array[i][11] + '&nbsp; - &nbsp;' + search_array[i][2] + '&nbsp;(' + search_array[i][3] + ') <br><br>' + '<p style="font-size: 14px;">Travel Time: ' + getDuration(search_array[i][11], search_array[i][12]) + ' &#8226; Distance: ' + search_array[i][17] +  ' miles</p>' + '<br>' + search_array[i][12] + '&nbsp; - &nbsp;' + search_array[i][6] + '&nbsp;(' + search_array[i][7] + ')<br><p style="font-size: 14px;"> ' + search_array[i][10] + ' &#8226; ' + ' Economy ' + ' &#8226; ' + search_array[i][21] + ' &#8226; ' + search_array[i][20] + '</p></div><div class="iter_div2" style="color: white; font-size:12px;"><p> <img src="legroom.png"> Average legroom (31in)<p><br><p><img src="wifi.png"> WiFi </p><br><p> <img src="mobile.png"> Stream Media to your Device</p></div></div>');
    
    $('#itinerary_div2').append('<div class="iter_div3" id="iter_div3" style="text-align:left;"><br><h4 style="margin-left:2%;" class="mainpage_headers">Check Seat Availability</h4><form style="margin-left:2%;"><input type="radio" name="seat" id="window" value="Window"> Window Seat</input><br><input type="radio" name="seat" id="aisle" value="Aisle"> Aisle Seat</input><br><input type="radio" name="seat" id="exit" value="Exit"> Exit Seat</input><br></form><br><div style="margin-left:2%;"><button onclick="checkSeatsNormal(' + i + ')">Check Availability</button></div><br><br></div>');
}

function checkSeatsNormal(i) {
    if(document.getElementById('window').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + search_array[i][18] + '&filter[is_window]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnother(' + i + ')">Pick Another</button></div></div>')
        }   
    }else if(document.getElementById('aisle').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + search_array[i][18] + '&filter[is_aisle]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnother(' + i + ')">Pick Another</button></div></div>')
        }
        
    }else if(document.getElementById('exit').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + search_array[i][18] + '&filter[is_exit]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnotherNormal(' + i + ')">Pick Another</button></div><br></div>')
        }
    }
}

function randomBooking(i) {
    let body = $('body');
    body.empty();
    
    body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Only a click away from an amazing trip.</h2></div>');
    body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    body.append('<br>');
    
    body.append('<div class="itinerary_div" id="itinerary_div"></div>');
    body.append('<div class="itinerary_div2" id="itinerary_div2"></div>');
    $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Search for Another Flight</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
    
    $('#itinerary_div').append('<h1 class="mainpage_headers">JLW Flights Information</h1>');
    $('#itinerary_div').append('<div class="iter_div" id="iter_div"><br><h3 style="margin-left:2%;" class="mainpage_headers">' + random_array[i][10] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#' + random_array[i][20] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$' + random_array[i][19] + '&nbsp;&nbsp;<button onclick="payRandomFlight(' + i + ')">Select</button></h3><br></div>');
    
    $('#itinerary_div').append('<div class="flight_info_div" id="flight_info_div"><br><div class="iter_div1" style="color: white;">' + random_array[i][11] + '&nbsp; - &nbsp;' + random_array[i][2] + '&nbsp;(' + random_array[i][3] + ') <br><br>' + '<p style="font-size: 14px;">Travel Time: ' + getDuration(random_array[i][11], random_array[i][12]) + ' &#8226; Distance: ' + random_array[i][17] + ' miles</p>' + '<br>' + random_array[i][12] + '&nbsp; - &nbsp;' + random_array[i][6] + '&nbsp;(' + random_array[i][7] + ')<br><p style="font-size: 14px;"> ' + random_array[i][10] + ' &#8226; ' + ' Economy ' + ' &#8226; ' + random_array[i][21] + ' &#8226; ' + random_array[i][20] + '</p></div><div class="iter_div2" style="color: white; font-size:12px;"><p> <img src="legroom.png"> Average legroom (31in)<p><br><p><img src="wifi.png"> WiFi </p><br><p> <img src="mobile.png"> Stream Media to your Device</p></div></div>');
    
    $('#itinerary_div2').append('<div class="iter_div3" id="iter_div3" style="text-align:left;"><br><h4 style="margin-left:2%;" class="mainpage_headers">Check Seat Availability</h4><form style="margin-left:2%;"><input type="radio" name="seat" id="window" value="Window"> Window Seat</input><br><input type="radio" name="seat" id="aisle" value="Aisle"> Aisle Seat</input><br><input type="radio" name="seat" id="exit" value="Exit"> Exit Seat</input><br></form><br><div style="margin-left:2%;"><button onclick="checkSeatsRandom(' + i + ')">Check Availability</button></div><br><br></div>');
}

function pickAnotherNormal(i) {
    $('.seat_list').replaceWith('<div class="iter_div3" id="iter_div3" style="text-align:left;"><br><h4 style="margin-left:2%;" class="mainpage_headers">Check Seat Availability</h4><form style="margin-left:2%;"><input type="radio" name="seat" id="window" value="Window"> Window Seat</input><br><input type="radio" name="seat" id="aisle" value="Aisle"> Aisle Seat</input><br><input type="radio" name="seat" id="exit" value="Exit"> Exit Seat</input><br></form><br><div style="margin-left:2%;"><button onclick="checkSeatsNormal(' + i + ')">Check Availability</button></div><br><br></div>');
}

function pickAnother(i) {
    $('.seat_list').replaceWith('<div class="iter_div3" id="iter_div3" style="text-align:left;"><br><h4 style="margin-left:2%;" class="mainpage_headers">Check Seat Availability</h4><form style="margin-left:2%;"><input type="radio" name="seat" id="window" value="Window"> Window Seat</input><br><input type="radio" name="seat" id="aisle" value="Aisle"> Aisle Seat</input><br><input type="radio" name="seat" id="exit" value="Exit"> Exit Seat</input><br></form><br><div style="margin-left:2%;"><button onclick="checkSeatsRandom(' + i + ')">Check Availability</button></div><br><br></div>');
}

function checkSeatsRandom(i) {
    if(document.getElementById('window').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + random_array[i][18] + '&filter[is_window]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnother(' + i + ')">Pick Another</button></div></div>')
        }   
    }else if(document.getElementById('aisle').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + random_array[i][18] + '&filter[is_aisle]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnother(' + i + ')">Pick Another</button></div></div>')
        }
        
    }else if(document.getElementById('exit').checked) {
        
        $.ajax(root_url + 'seats?filter[plane_id]=' + random_array[i][18] + '&filter[is_exit]=true', 
        {
            type: 'GET',
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qarray = response;
                
                for (let i=0; i<qarray.length; i++) {
                    seats_array[i] = [];
                    seats_array[i][0] = qarray[i].id;
                    seats_array[i][1] = qarray[i].row;
                    seats_array[i][2] = qarray[i].number;
                }
        }
    });
        
        if(seats_array.length == 0) {
            $('.iter_div3').append('<p style="margin-left:2%; color: red;">There are no more available seats of this kind. Please pick a different type.</p><br>')
        } else {
            $('.iter_div3').replaceWith('<div class="seat_list" id="seat_list"><h4 class="mainpage_headers" style="margin-left:2%;">Here are the available seats</h4><br> <select style="margin-left:5%; class="dropdown_seat" id="dropdown_seat"></select><button onclick="appendSeat()">Click to See</button><br><br><div style="margin-left:2%;"><button onclick="pickAnother(' + i + ')">Pick Another</button></div><br></div>')
        }
    }
}

function appendSeat() {
    for(let i=0; i < seats_array.length; i++) {
        $('#dropdown_seat').append('<option value = "' + seats_array[i][0] + '">' + seats_array[i][1] + seats_array[i][2] + '</option>');
    }
}

function checkFlights() {
    console.log(airports_array[1]);
}

function googleDistanceMatrix(index) {

        // calculate distance
        function calculateDistance() {
            var origin = search_array[index][2];
            var destination = search_array[index][6];
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.FLYING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                    // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                }, callback);
        }
        // get distance results
        function callback(response, status) {
            if (status != google.maps.DistanceMatrixStatus.OK) {
                $('#result').html(err);
            } else {
                var distance = response.rows[0].elements[0].distance;
                var duration = response.rows[0].elements[0].duration;
                var distance_in_kilo = distance.value / 1000; // the kilom
                var distance_in_mile = distance.value / 1609.34; // the mile
                return distance_in_mile;
            }
        }

};

function payNormalFlight(i) {
    let seatcode = $('#dropdown_seat option:selected').val();
    let seatcode_str = findSeat(seatcode);
    
    $('.iter_div').replaceWith('<div class="iter_div4"><br><h4 style="margin-left:2%;" class="mainpage_headers"> Total Cost: $' + search_array[i][19] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Seat Number: ' + seatcode_str + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pay with JLW Rewards: $1025.34 remaining &nbsp;&nbsp;<button onclick="assignNormalTicket(' + i + ')">Pay and Confirm Flight</button></h4><br></div>')
}

function payRandomFlight(i) {
    let seatcode = $('#dropdown_seat option:selected').val();
    let seatcode_str = findSeat(seatcode);
    
    $('.iter_div').replaceWith('<div class="iter_div4"><br><h4 style="margin-left:2%;" class="mainpage_headers"> Total Cost: $' + random_array[i][19] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Seat Number: ' + seatcode_str + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pay with JLW Rewards: $1025.34 remaining &nbsp;&nbsp;<button onclick="assignRandomTicket(' + i + ')">Pay and Confirm Flight</button></h4><br></div>')
}

function assignNormalTicket(i) {
        
        let confirmationcode = (Math.floor(Math.random() * 1000000)).toString();
    
		$.ajax({
			url: root_url + "itineraries",
			type: "POST",
            dataType:'json',
            xhrFields: {withCredentials: true},
			data: {
				"itinerary": {
                     "confirmation_code": confirmationcode,
			         "email": "yuanming@live.unc.edu"
                }
			},
			success: (response) => {                
				$.ajax({
					url: root_url + "tickets",
					type: "POST",
                    dataType:'json',
                    xhrFields: {withCredentials: true},
					data: {
						"ticket": {
                            "first_name":   "Jeffrey",
                            "middle_name":  "Yuanming",
                            "last_name":    "Mei",
                            "age":          20,
                            "gender":       "male",
                            "is_purchased": true,
                            "price_paid":   (search_array[i][19]).toString(),
                            "instance_id":  8,
                            "seat_id":      21
                        }
					},
                    success: () => {
                        console.log('successfully posted');
                    },
                    error: () => {
                        console.log('error');
                    }
				});
                let body = $('body');
                body.empty();
    
                body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Thank you for using JLW.</h2></div>');
                body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
                body.append('<br>');
    
                body.append('<div class="confirm_div" id="confirm_div"></div>');
                $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Purchase Another Flight</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
                
                $('.confirm_div').append('<div class="con_div1"><h2 style="margin-left:5%;" class="mainpage_headers">Your Itinerary</h2><br><p style="color: white; margin-left:5%;">Confirmation Number: ' + confirmationcode + '</p><br><p style="color: white; margin-left:5%;">Price Paid: $' + search_array[i][19] + '</p><div style="color: white; margin-left:5%;">' + search_array[i][11] + '&nbsp; - &nbsp;' + search_array[i][2] + '&nbsp;(' + search_array[i][3] + ') <br><br>' + '<p style="font-size: 14px;">Travel Time: ' + getDuration(search_array[i][11], search_array[i][12]) + ' &#8226; Distance: ' + search_array[i][17] + ' miles</p>' + '<br>' + search_array[i][12] + '&nbsp; - &nbsp;' + search_array[i][6] + '&nbsp;(' + search_array[i][7] + ')<br><p style="font-size: 14px;"> ' + search_array[i][10] + ' &#8226; ' + ' Economy ' + ' &#8226; ' + search_array[i][21] + ' &#8226; ' + search_array[i][20] + '</p></div></div>');
            }
        });    
};

function assignRandomTicket(i) {
        
        let confirmationcode = (Math.floor(Math.random() * 1000000)).toString();
    
		$.ajax({
			url: root_url + "itineraries",
			type: "POST",
            dataType:'json',
            xhrFields: {withCredentials: true},
			data: {
				"itinerary": {
                     "confirmation_code": confirmationcode,
			         "email": "yuanming@live.unc.edu"
                }
			},
			success: (response) => {                
                $.ajax({
					url: root_url + "tickets",
					type: "POST",
                    dataType:'json',
                    xhrFields: {withCredentials: true},
					data: {
                        "ticket": {
                            "first_name":   "Jeffrey",
                            "middle_name":  "Yuanming",
                            "last_name":    "Mei",
                            "age":          20,
                            "gender":       "male",
                            "is_purchased": true,
                            "price_paid":   (random_array[i][19]).toString(),
                            "instance_id":  8,
                            "seat_id":      21
                        }
					},
                    success: () => {
                        console.log('successfully posted');
                    },
                    error: () => {
                        console.log('error');
                    }
				});
                
                console.log(response);
                let body = $('body');
                body.empty();
    
                body.append('<div class="button_top"><img src="logo.png" width="60" height="60"><h2 class = "mainpage_headers fadeIn">Thank you for using JLW.</h2></div>');
                body.append('<div class="btn-group"><button style="width:33%" onclick="findPopular()">Find Popular Flights!</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
                body.append('<br>');
    
                body.append('<div class="confirm_div" id="confirm_div"></div>');
                $('.btn-group').replaceWith('<div class="btn-group"><button style="width:33%" onclick="build_air_interface()">Purchase Another Flight</button>' +
                '<a href="Map1.html"><button style="width:33%">Find Airports Near You</button></a><button style="width:33%" onClick="window.location.reload()">Sign Out</button></div>')
                
                $('.confirm_div').append('<div class="con_div1"><h2 style="margin-left:5%;" class="mainpage_headers">Your Itinerary</h2><br><p style="color: white; margin-left:5%;">Confirmation Number: ' + confirmationcode + '</p><br><p style="color: white; margin-left:5%;">Price Paid: $' + random_array[i][19] + '</p><div style="color: white; margin-left:5%;">' + random_array[i][11] + '&nbsp; - &nbsp;' + random_array[i][2] + '&nbsp;(' + random_array[i][3] + ') <br><br>' + '<p style="font-size: 14px;">Travel Time: ' + getDuration(random_array[i][11], random_array[i][12]) + ' &#8226; Distance: ' + random_array[i][17] + ' miles</p>' + '<br>' + random_array[i][12] + '&nbsp; - &nbsp;' + random_array[i][6] + '&nbsp;(' + random_array[i][7] + ')<br><p style="font-size: 14px;"> ' + random_array[i][10] + ' &#8226; ' + ' Economy ' + ' &#8226; ' + random_array[i][21] + ' &#8226; ' + random_array[i][20] + '</p></div></div><br><br>');
                
                $('.confirm_div').append('<h3 style="margin-left:5%;" class="mainpage_headers">Here are the directions to the departure airport</h3>');
                $('.confirm_div').append('<div class="con_div2" id="map"></div>');
                var map = new google.maps.Map(document.getElementById('map'),{
                    zoom: 7,
                    center: {lat: 35.91, lng:- 79.05 }
                });
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setMap(map);
                $('.con_div2').append(map);
                
                let start = prompt('One more step! Please enter your starting address to assist your travel.');
                let airport1 = random_array[i][2];
                
                directionsService.route({
                origin: start,
                destination: airport1,
                travelMode: 'DRIVING'
                }, function(response, status) {
                    if(status == 'OK'){
                        console.log('direction success');
                        directionsDisplay.setDirections(response);
                    }else{
                        alert("Unknown Location");
                    }
                });
            }
        });    
};

function setAddress() {
    var address = prompt('Please enter your starting address');
}

