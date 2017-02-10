
function initialiseMap() {
  var map;
  var locations = [];
  $.get('swc-events-data.csv', function(data) {
        // Modify the code below to suit the structure of your spreadsheet.
        data = $.csv.toArrays(data);

        // Remove first header row
        data = data.slice(1);
        $(data).each(function() {
		var location = {};
		location.title = this[4];
                location.latitude = parseFloat(this[7]);
                location.longitude = parseFloat(this[8]);
                location.venue = this[5];
                location.url = this[9];
                locations.push(location);
      });

      // Center on UK (54, -4)
      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(54.75, -4.1)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      //var bounds = new google.maps.LatLngBounds();
      //var southWest = new google.maps.LatLng(50.80, -8.45);
      //var northEast = new google.maps.LatLng(56.90, 0.78);
      //var bounds = new google.maps.LatLngBounds(southWest, northEast);

      // Create nice, customised pop-up boxes, to appear when the marker is clicked on
      var infowindow = new google.maps.InfoWindow({
        content: "Content String"
      });

      // Add each new marker to the map
      for (var i = 0; i < locations.length; i++) {
        var new_marker = createMarker(map, locations[i], infowindow);
        //bounds.extend(new_marker.position);
      }
      //map.fitBounds(bounds);
  });
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
    icon: 'pin-images/'+location.title.toLowerCase()+'-pin.png',
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>' + ((location.url === undefined) ? location.title : ('<a href="' + location.url +'">' + location.title + '</a>')) + '</strong></p>' +
    ((location.venue === undefined) ? "" : ('<p><strong>Lead venue: </strong>' + location.venue + '</p>')) +
    '</div>');
    infowindow.open(map, marker);
  });
  return marker;
}
