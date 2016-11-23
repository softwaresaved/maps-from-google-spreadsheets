var map;
var locations = [];

function initialiseMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns
  // Replace the ID of your Google spreadsheet in the URL:
  // https://spreadsheets.google.com/feeds/list/ID_OF_YOUR_GOOGLE_SPREADSHEET/od6/public/values?alt=json
  $.getJSON("https://spreadsheets.google.com/feeds/list/1fBLlw8xlO_yhL8rYfFlQnzvKR-swEtE7NRX41ysARCk/od6/public/values?alt=json", function(data) {
    	// Modify the code below to suit the structure of your spreadsheet
    	var entries = data.feed.entry;
    	$(entries).each(function() {
    		var location = {};
				location.title = this['gsx$title']['$t'];
				location.latitude = parseFloat(this['gsx$lat']['$t']);
      	location.longitude = parseFloat(this['gsx$lng']['$t']);
        location.institution = this['gsx$leadroname']['$t'];
       	location.department = this['gsx$department']['$t'];
        location.funder = this['gsx$fundingorgname']['$t'];
        location.url = this['gsx$gtrprojecturl']['$t'];
	  		locations.push(location);
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(0, 0)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow);
    bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: location.title,
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>' + ((location.url === undefined) ? location.title : ('<a href="' + location.url +'">' + location.title + '</a>')) + '</strong></p>' +
    ((location.institution === undefined) ? "" : ('<p><strong>Lead institution: </strong>' + location.institution + '</p>')) +
    ((location.department === undefined) ? "" : ('<p><strong>Department: </strong>' + location.department + '</p>')) +
    ((location.funder === undefined) ? "" : ('<p><strong>Funder: </strong>' + location.funder + '</p>')) +
    '</div>');
    infowindow.open(map, marker);
  });
  return marker;
}