function initialiseMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1fBLlw8xlO_yhL8rYfFlQnzvKR-swEtE7NRX41ysARCk/values/Sheet1!A2:Q?key=AIzaSyD112yF6ORTtrx1-ugfhJLcx1VHDOla1Vs",
    data => {
      // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
      // Modify the code below to suit the structure of your spreadsheet.
      const locations = data.values.map(row => {
        return {
          title: row[2],
          position: {
            lat: parseFloat(row[15]),
            lng: parseFloat(row[16]),  
          },
          institution: row[3],
          department: row[4],
          funder: row[0],
          url: row[13]
        };
      });

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: new google.maps.LatLng(0, 0)
      });
      setLocations(map, locations);
    }
  );
}

function setLocations(map, locations) {
  const bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  const infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  locations.forEach(location => {
    bounds.extend(createMarker(map, location, infowindow).position);
  });
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {
  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  const marker = new google.maps.Marker({
    position: location.position,
    map: map,
    title: location.title
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(
      `<div>
        <p><strong>
        ${location.url === undefined
          ? location.title
          : `<a href="${location.url}">${location.title}</a>`}
        </strong></p>
        ${location.institution === undefined
          ? ""
          : `<p><strong>Lead institution: </strong>${location.institution}</p>`}
        ${location.department === undefined
          ? ""
          : `<p><strong>Department: </strong>${location.department}</p>`}
        ${location.funder === undefined
          ? ""
          : `<p><strong>Funder: </strong>${location.funder}</p>`}
      </div>`
    );
    infowindow.open(map, marker);
  });
  return marker;
}
