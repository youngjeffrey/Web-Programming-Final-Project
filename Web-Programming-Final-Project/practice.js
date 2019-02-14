var root_url = "http://comp426.cs.unc.edu:3001";
var userID
var userPassword

var airports = null;
var planes = null;
var airlines = null;
var flights = null;
var instances = null;
var seats = null;

let getAllIteneraries = function(){
	let url =  root_url + "/itineraries";
	$.ajax({
		url: url,
		type: "GET",
		xhrFields: {withCredentials: true},
		async: false,
		success: (response) => {
			result = response;
		}
	});
	return result; 
}

let getAllTickets = function(){
	let url =  root_url + "/tickets";
	$.ajax({
		url: url,
		type: "GET",
		xhrFields: {withCredentials: true},
		async: false,
		success: (response) => {
			result = response;
		}
	});
	return result; 
}
let getItenbyID= function(id){
	return queryFilterById("itineraries",id);
}

let queryFilterEndpoint = function(endpoint, filters){
	let url = root_url + "/" + endpoint + "?";
	filters.forEach(function(element, index){
		url += "filter[" + element.name + "]=" + element.value;
		if (index !== filters.length - 1) url += "&";
	});
	let result = null;
	$.ajax({
		url: url,
		type: "GET",
		xhrFields: {withCredentials: true},
		async: false,
		success: (response) => {
			result = response;
		}
	});
	return result;
}

let queryFilterById = function(endpoint, id){
	let result = null;
	$.ajax({
		url: root_url + "/" + endpoint + "/" + id,
		type: "GET",
		xhrFields: {withCredentials: true},
		async: false,
		success: (response) => {
			result = response;
		}
	});
	return result;
}

let initData = function(){
	let toLoad = [
		{name: "airports"},
		{name: "airlines"},
		{name: "flights"},
		{name: "instances"},
		{name: "seats"},
		{name: "planes"}
	];

	toLoad.forEach(function(element){
		$.ajax({
			url: root_url + "/" + element.name,
			xhrFields: {withCredentials: true},
			type: "GET",
			success: (response) => window[element.name] = response
		})
	});
};

let getInstance=function(id,date){
	let allInstances = getInstancesByFlightId(id);
	let instance = allInstances.filter(item => item.date == date)[0];
	return instance; 
}

let getFlightById = function(id){
	return queryFilterById("flights",id);
}

let getAirportById = function(id){
	return queryFilterById("airports",id);
};

let getAirlineById = function(id){
	return airlines.filter((item) => item.id === id)[0];
}

let getInstancesByFlightId = function(id){
	return queryFilterEndpoint("instances", [{name: "flight_id", value: id}]);
};

let getNonpurchasedSeats = function(flight, instanceId){
	let seats = queryFilterEndpoint("seats", [{name: "plane_id", value: flight.plane_id}]);
	let takenTickets = queryFilterEndpoint("tickets", [{name: "instance_id", value: instanceId}]);
	let takenSeats = [];
	takenTickets.forEach((item) => {
		takenSeats.push(queryFilterById("seats", item.seat_id).id);
	});
	return seats.filter((seat) => !takenSeats.includes(seat.id));
};

let instanceExist = function(id,date){
	if( (instances.filter((item) => item.flight_id === id).filter((item) => item.date === date)).length >0 ){
		return true; 
	}
	return false; 
}

let getRandomFlight = function(){
	let category = $(this).data("category");
	let flightOptions = [];
	while (flightOptions.length === 0){
		if (category === "winter"){
			let airportsPossible = queryFilterEndpoint("airports", [{name: "state", value: "AK"}]);
			let airportId = airportsPossible[Math.floor(Math.random() * airportsPossible.length)].id;
			flightOptions = queryFilterEndpoint("flights", [{name: "arrival_id", value: airportId}]);
		} else if (category === "summer"){
			let airportsPossible = queryFilterEndpoint("airports", [{name: "state", value: "FL"}]);
			let airportId = airportsPossible[Math.floor(Math.random() * airportsPossible.length)].id;
			flightOptions = queryFilterEndpoint("flights", [{name: "arrival_id", value: airportId}]);
		} else if (category === "jeffrey"){
			let airportsPossible = queryFilterEndpoint("airports", [{name: "state", value: "NV"}]);
			let airportId = airportsPossible[Math.floor(Math.random() * airportsPossible.length)].id;
			flightOptions = queryFilterEndpoint("flights", [{name: "arrival_id", value: airportId}]);
		}
	}
	let flightChosen = flightOptions[Math.floor(Math.random() * flightOptions.length)];
	let possibleInstances = getInstancesByFlightId(flightChosen.id);
	let instanceChosen = possibleInstances[Math.floor(Math.random() * possibleInstances.length)];
	let arrivalAirport = getAirportById(flightChosen.arrival_id);

	var place = new google.maps.LatLng(arrivalAirport.latitude, arrivalAirport.longitude);

	let map = new google.maps.Map(document.getElementById('map'), {
		center: place,
		zoom: 15
	});

	let request = {
		location: place,
		radius: '500',
	};

	let assignTicket = function(results){
		let itin = {
			confirmation_code: Math.floor(Math.random() * 1000000).toString(),
			email: "youngjt@jeffrey.com"
		};
		$.ajax({
			url: root_url + "/itineraries",
			xhrFields: {withCredentials: true},
			type: "POST",
			data: {
				itinerary: itin
			},
			success: (response) => {
				console.log(response);
				let availableSeats = getNonpurchasedSeats(flightChosen, instanceChosen.id);
				if (availableSeats.length === 0){
					alert("There are no seats left on this flight, maybe take a train");
				}
				let seatChosen = availableSeats[Math.floor(Math.random() * availableSeats.length)];
				let ticket = {
					first_name: "Jeffrey",
					middle_name: "Todd",
					last_name: "Young",
					age: 23,
					gender: "male",
					is_purchased: true,
					price_paid: Math.random() * 500,
					instance_id: instanceChosen.id,
					itinerary_id: response.id,
					seat_id: seatChosen.id
				};
				$.ajax({
					url: root_url + "/tickets",
					xhrFields: {withCredentials: true},
					type: "POST",
					data: {
						ticket: ticket
					}
				});
				fillUI(ticket, itin, seatChosen, results)
			}
		});

	};

	let fillUI = function(ticket, itin, seat, results){
		let flightContainer = $("<div class='specificFlight randomFlightDiv' </div>");

		//remove any previous
		$(".randomFlightDiv").remove();

		let overallContainer = $(".flights.randomFlights");
		let departTime = flightChosen.departs_at.split('T')[1].split('.')[0];
		let arriveTime = flightChosen.arrives_at.split('T')[1].split('.')[0];

		overallContainer.append(' <div class="specificFlight randomFlightDiv"><div class="times"> <br> <br>  <br>'+ departTime + " - " + arriveTime +'</div><div class="info"><br>'+ getAirlineById(flightChosen.airline_id).name +'<br><br><p>'+getAirportById(flightChosen.departure_id).code+' &rarr; '+getAirportById(flightChosen.arrival_id).code+'</div><div class="price"> <br> $1251 </div> </div>');
		let mainDiv = $(".main");
		$(".GADetails").remove();
		mainDiv.after($("<div class='GADetails'> Click here to view all of the intersting things that you can do during your trip!</div>"));
		$(".GADetails").click(() => {
			$(".jeffrey").hide();
			let tripDetailsContainer = $("<div class='detailsContainer'> </div>");
			$("body").append(tripDetailsContainer);
			let title = $("<h2 class='detailsTitle'> Here are some amazing things that you can do during your trip</h2>");
			tripDetailsContainer.append(title);
			let hbox = $("<div class='hbox'> </div>");
			title.after(hbox);
			let tabBar = $("<div class='tabBar'> </div>");
			let backButton = $("<button class='backButton'> Back To Flights </button>");
			backButton.click(() => {
				$(".detailsContainer").remove();
				$(".jeffrey").show();
			});

			tabBar.append(backButton);
			results.forEach((element, index) => {
				if (index > 12) return;
				let itemLabel = $("<label class='tabItem'>" + element.name + "</label>");
				itemLabel.data("placeName", element.name);
				tabBar.append(itemLabel);	
			});
			hbox.append(tabBar);
			results.forEach((element, index) => {
				let contentContainer = $("<div class='detailsContentContainer vbox'> </div>");
				contentContainer.data("placeName", element.name);
				if (!!element.photos){
					let imgContainer = $("<div class='imageContainer'> </div>");
					let imgSrc = !!element.photos ? element.photos[0].getUrl() : "";
					let img = $("<img src='" + imgSrc + "' class='contentImage flexHbox' alt='This place has no pictures available. Seems sketchy, probably should avoid this.'>");
					imgContainer.append(img);
					contentContainer.append(imgContainer);
				} else {
					let noImageText = $("<p class='.noPhotosLabel'> There were no photos found for this location, seems sketchy. </p>");
					contentContainer.append(noImageText);
				}
				

				//add text
				let ratingLabel = null;
				let ratingImg = null;
				let ratingImgContainer = null;
				if (element.rating < 3.7333333333333){
					ratingImgContainer = $("<div class='ratingImgContainer'> </div>");
					ratingLabel = $("<label class='ratingLabel'> This place has a rating of " + element.rating + ". Therefore it is pure garbage</label>");
					ratingImg = $("<img src='trashCan.jpg' class='ratingImg' alt='Couldn't load trash can'>");
					ratingImgContainer.append(ratingImg);
				} else {
					if (!element.rating){
						ratingLabel = $("<label class='ratingLabel'> This place has no listed rating" + ". Avoid at all costs</label>");
					} else {
						ratingLabel = $("<label class='ratingLabel'> This place has a rating of " + element.rating + ". This may be a good place to go</label>");
					}
					ratingImgContainer = $("<div class='ratingImgContainer'> </div>");
					ratingImg = $("<img src='goodPlace.jpg' class='ratingImg' alt='Couldn't load good place'>");
					ratingImgContainer.append(ratingImg);
				}
				
				let otherHbox = $("<div class='hbox noHeight centerAlign'> </div>");

				otherHbox.append(ratingLabel);
				otherHbox.append(ratingImgContainer);
				contentContainer.append(otherHbox);

				hbox.append(contentContainer);
			});

			$('.tabItem').click(function(){
				let tabName = $(this).data("placeName");
				let contentContainers = $(".detailsContentContainer");
				let getTabContentByPlaceName = function(pn){
					for (let i = 0; i < contentContainers.length; i++){
						if (pn === $(contentContainers[i]).data("placeName"))
							return $(contentContainers[i]);
					}
				}
				contentContainers.hide();
				getTabContentByPlaceName(tabName).css("display", "flex");
			});
			
		});
		console.log(results);
	};

	let callback = function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			console.log(results);
			assignTicket(results);
			
		} else {
			alert("Something went wrong with the google maps call");
		}
	};

	let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

};

let setupRandomTab = function(){
	let randomImgs = $(".randomImg");
	randomImgs.click(getRandomFlight);

	randomImgs.css("cursor", "pointer"); //make images look clickable

	
};

$(document).ready(() => {
	// Log In Initial 
	$('.bookedFlight').toggle();
	$('#conf_search').toggle();
	let debug = false;

    $('#login_btn').on('click', () => {
	
	let user = debug ? "gabistein" : $('#login_user').val();
	let pass = debug ? "123456" : $('#login_pass').val();
	
	
	$.ajax(root_url + '/sessions',
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
			 $('.topnav').toggle();
			 $('.login_container').toggle();
			 $('.jeffrey').toggle();
			 initData();
			 setupRandomTab();
		     console.log("success");
		   },
		   error: () => {
		       alert('error, login again!');
		   }
	       });
	});
	

	// to go back 
	$(document).on('click', '.back', function() {
		// console.log('back');
		$('.bookedFlight').toggle();
		$('.flights').toggle();
		$('.bookFlight').toggle();
		}
	);
	
	$(document).on('click', '.book', function(event) {
		let times = event.target.parentNode.parentNode.parentNode.querySelectorAll('.times')[0].innerText;
		let confNumber = 0; 
		let timesArray = times.split('-');
		let depTime = timesArray[0];
		let arriveTime = timesArray[1].split(' ')[1].slice(0,8);
		var fName = prompt("What is your first name?");
		var mName = prompt("What is your middle name?");
		var lName = prompt("What is your last name?");
		var email = prompt("What is your email?");
		var age = prompt("What is your age?");
		var gender = prompt("What is your gender?");
		var confirm = prompt("Do you promise to pay for this flight? Y or N");
		if (confirm != 'Y') {
		alert("Nice try");
		} else {
		confNumber = Math.floor(Math.random()*1000000)
		console.log(fName);
		// Get instance and flight:
		let chosenFlightId = event.target.parentNode.parentNode.parentNode.querySelectorAll('.info')[0].innerText.split('-')[1];
		let chosenFlight = getFlightById(parseInt(chosenFlightId));
		let choseInstance = getInstance(chosenFlight.id,$('#departureDate').val());
		// // Make itenerary and ticket object
		console.log(fName);
			$.ajax({
				url: root_url + "/itineraries",
				xhrFields: {withCredentials: true},
				type: "POST",
				data: {
					itinerary: {
							confirmation_code: confNumber,
							email: email
					}
				},
				success: (response) => {
					console.log('made an itnerary');
					
					let availableSeats = getNonpurchasedSeats(chosenFlight, choseInstance.id);
					if (availableSeats.length === 0){
						alert("There are no seats left on this flight, maybe take a train");
					}
					let seatChosen = availableSeats[Math.floor(Math.random() * availableSeats.length)];
					let ticket = {
						first_name: fName,
						middle_name: mName,
						last_name: lName,
						age: age,
						gender: gender,
						is_purchased: true,
						instance_id: choseInstance.id,
						itinerary_id: response.id,
						seat_id: seatChosen.id
					};
					$.ajax({
						url: root_url + "/tickets",
						xhrFields: {withCredentials: true},
						type: "POST",
						data: {
							ticket: ticket
						},
						success: (response) => {
							console.log('ticket made');
						}
					});
				}
			});
	
		};
	

		document.getElementById('lName').innerHTML = "" + lName;
		document.getElementById('mName').innerHTML = "" + mName;
		document.getElementById('fName').innerHTML = "" + fName;
		// Getting correct airport in span from input
		document.getElementById('depAirport').innerHTML = $('#dAirports').val().split(', ')[1];
		document.getElementById('arrAirport').innerHTML = $('#aAirports').val().split(', ')[1]; 
		
		// Put in correct time in span from input
		document.getElementById('depTime').innerHTML = depTime;
		document.getElementById('arrTime').innerHTML = arriveTime; 

		// Set confirmation Code
		document.getElementById('confCode').innerText = "Confirmation Code: "+ confNumber;
		console.log(document.getElementById('confCode'));


		$('.flights').toggle();
		$('.bookFlight').toggle();
		$('.bookedFlight').toggle();
		
	});
	
	if (debug) $("#login_btn").trigger("click");

	$('.signout').click(function(){
		$('.topnav').toggle();
		$('.login_container').toggle();
		$('.jeffrey').toggle();
		$('.GADetails').toggle();
	})

	// Click on Normal Mode 
	$('#random').click(function(){
		if($('.normalOptions').hasClass("randomOptions")){
			return; 
		}
		$('.normalOptions').addClass('randomOptions');
		$('.randomImg').toggle();
		$('.randomTitle').toggle();
		$('h2').toggle();
		$('.flightInfo').toggle();
		$('.seats').toggle();
		$(".flights.normalFlights").toggle();
		$(".flights.randomFlights").toggle();
		
	});

	$('#normal').click(function(){
		if($('.normalOptions').hasClass("randomOptions")){
			$('.randomImg').toggle();
			$('.randomTitle').toggle();
			$('h2').toggle();
			$('.flightInfo').toggle();
			$('.seats').toggle();
			$(".flights.normalFlights").toggle();
			$(".flights.randomFlights").toggle();
			
			$('.normalOptions').removeClass('randomOptions');
		}
	});

	function getUserInfo() {
		var userForm = document.getElementById("loginForm");
		userID = userForm.elements[0].value;
		userPassword = userForm.elements[1].value;
	}



	$('#search_flight').on('click', () => {
		let greaterZero = false; 
		$('.normalFlights').empty();
		let dAirports = $('#dAirports').val().split(', ')[1];
		let dDate = $('#departureDate').val();
		if(dDate.length > 0){
			greaterZero = true; 
		}
		let aAirport = $('#aAirports').val().split(', ')[1];
		let aDate = $('#arrivalDate').val();
		let isWindow = $('#window').prop('checked');
		let isAisle = $('#aisle').prop('checked');
		let noPrefSeat = $('#anySeat').prop('checked');
		let instanceID = 0; 
		let price; 
		// let instanceObj;
		// Get airport name and get departure id and arrival id from airports
		let departID; 
		let arrivalID; 
		let filteredFlights =[]; 

		for(let i = 0; i < airports.length; i++){
			if(airports[i].name.includes(dAirports)){
				departID = airports[i].id;
			}else if (airports[i].name.includes(aAirport)){
				arrivalID = airports[i].id;
			}
		}
		for(let i = 0; i <flights.length; i++){
			// price = (Math.random() * 500).toFixed(2)
			// filteredFlights[filteredFlights.length] = flights[i];
			if(flights[i].arrival_id == arrivalID && flights[i].departure_id == departID){
				filteredFlights[filteredFlights.length]=flights[i];
				// check if instance exists with flight and date, if it does then do post
				let instanceIDs = [];
				instanceIDs = getInstancesByFlightId(flights[i].id);
				for(let i = 0; i < instanceIDs.length; i++){
					if(instanceIDs[i].date == dDate){
						instanceID = instanceIDs[i].id;
					}
				}
				if(!greaterZero){
					alert('Enter a departure date!');
					return; 
				}
				// instanceID =instanceIDs.filter(flights =>flights.date ===dDate)[0].id;
				
				if(instanceIDs == []){instanceID = null;}
				// console.log(instanceID);
				price = (Math.random() * 500).toFixed(2)
				if(instanceID != 0){
					$.ajax({
						xhrFields: {withCredentials: true},
						url: "http://comp426.cs.unc.edu:3001/instances/" + instanceID,
						type: "PUT",
						data: {
							instance : {
							"id": instanceID,
							"flight_id": flights[i].id,
							"date": dDate,
							"info": (price).toString()
							}
						},
						success: () => {
							
							console.log("success");
						  },
						  error: () => {
							 console.log("error");
						  }
					})
				} else {
					$.ajax({
						xhrFields: {withCredentials: true},
						url: "http://comp426.cs.unc.edu:3001/instances",
						type: "POST",
						data: {
							instance : {
							"flight_id": flights[i].id,
							"date": dDate,
							"info": (price).toString()
							}
						},
						success: () => {
							
							console.log("success");
						  },
						  error: () => {
							 console.log("error");
						  }
					})
				}
				
				
				
			}
		}
		
		// console.log(filteredFlights);
		if(filteredFlights.length > 0){
			for(let i = 0; i<filteredFlights.length; i++){
				// let instance = getInstancesByFlightId(flights[i].id);
				// console.log(instance.info);
				let departTime = filteredFlights[i].departs_at.split('T')[1].split('.')[0];
				let arriveTime = filteredFlights[i].arrives_at.split('T')[1].split('.')[0];
				let airline = getAirlineById(filteredFlights[i].airline_id).name;
				$('.normalFlights').append(' <div class="specificFlight"><div class="times"> <br> <br>  <br>'+ departTime + " - " + arriveTime + '<br><br>C'+ i +'</div><div class="info"><br>'+ airline +'<br><br><p>'+getAirportById(departID).code+' &rarr; '+getAirportById(arrivalID).code+'<br><br>'+getAirlineById(filteredFlights[i].airline_id).info +'-'+ filteredFlights[i].id+'</div><div class="price"> <br> $'+getInstance(filteredFlights[i].id,dDate).info+'<button class="book" style="vertical-align:middle"><span>Book Flight</span></button></div> </div>');
	
			}
		} else{
			$('.normalFlights').append('<p>No flights available between those cities, choose again</p>');
		}
		
		});
	// Back to flight search
	$('.flight_search').on('click', ()=>{
		if($('.main').hasClass('clickedFlight')){
			console.log('here');
			return; 
		} else{
		$('.main').addClass('clickedFlight');
		$('.main').toggle();
		$('#conf_search').toggle();
		}
		
	})
	// Building confirmation number searchd
	$('.search_confirm').on('click', ()=>{
		if($('.main').hasClass('clickedFlight')){
			$('.main').removeClass('clickedFlight');
			console.log('search confirmation');
			$('.main').toggle();
			$('#conf_search').toggle();
			// let iteneraries = getAllIteneraries();
			let allTickets = getAllTickets();
			console.log(allTickets);
			// paste all iteneraries
			for(let i = 0; i < allTickets.length; i ++){
				//console.log(allTickets[i].itinerary_id);
				let currentIten = getItenbyID(allTickets[i].itinerary_id);
				// console.log(currentIten);
				let itenAdd = '<div style = "height = 50px;" class="confirmedFlight"><h3>Your Flight Itinerary</h3><span id="name"><span><b>Name: </b></span><span id="lName">' + allTickets[i].last_name +'</span><span>, </span><span id="fName">'+allTickets[i].first_name+'</span><span> </span><span id="mName">'+ allTickets[i].last_name+'</span></span><br><p><b>Flight Status:</b> Confirmed</p><br><br><span id = "confCode"><b>Confirmation Code:'+currentIten.confirmation_code+' </b></span> </div>';
				console.log(itenAdd);
				$('#conf_search').append(itenAdd);
			}
			$("#site-search").keyup(function(){
			// Search functionality with key event listeners
				let valThis = $(this).val()
				$('.confirmedFlight').each(function(){
					var text = $(this)[0].childNodes[6].innerText.split(':')[1];
					(text.indexOf(valThis) >=0) ? $(this).children().show() : $(this).children().hide();
				});
			});
		
		} else{
			return; 
		}
		
	})
	
});