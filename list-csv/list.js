$(document).ready(function() {
  var locations = [];

  $.get('swc-events-data.csv', function(data) {
      data = $.csv.toArrays(data);

      // Remove first header row
      data = data.slice(1);
      $(data).each(function() {
                var location = {};
                location.title = this[4];
                location.startdate = this[2];
                location.enddate = this[3];
                location.latitude = parseFloat(this[7]);
                location.longitude = parseFloat(this[8]);
                location.venue = this[5];
                location.url = this[9];
                locations.push(location);
      });

      // Add each new marker to the table
      for (var i = 0; i < locations.length; i++) {
        addToTable('list', locations[i]);
      }
  });
  $('#list > tbody > tr:odd').css("background-color", "#EEEEEE");
});

function addToTable(tableID, location) {
  $('#list > tbody:last-child').append(
      '<tr><td>'+location.title+'</td>'+
      '<td><a href=\"'+location.url+'\">'+location.venue+'</a></td>' +
      '<td>'+shortDate(location)+'</td>'
  );
}

function shortDate(location) {
  // Use moment.js and twix.js libraries to produce a shortened readable date
  var startDate = new Date(location.startdate).toISOString();
  var endDate = new Date(location.enddate).toISOString();
  return moment(startDate).twix(endDate, {allDay: true, implicitYear: true}).format();
}
