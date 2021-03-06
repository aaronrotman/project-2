// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  MICRO: new L.LayerGroup(),
  REGIONAL: new L.LayerGroup(),
  LARGE: new L.LayerGroup(),
  PLANNING: new L.LayerGroup(),
  BREWPUB: new L.LayerGroup(),
  CONTRACT: new L.LayerGroup(),
  OTHER: new L.LayerGroup()
};

var map = L.map("map-id", {
  center: [37.7749, -122.4194],
  zoom: 12,
  layers: [
      layers.MICRO,
      layers.REGIONAL,
      layers.LARGE,
      layers.PLANNING,
      layers.BREWPUB,
      layers.CONTRACT,
      layers.OTHER
    ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

//ISSUE: colors not pulling into legend, colors need to be updated to match markers
// function getColor(d) {
//   return d === 'Micro'  ? "#de2d26" :
//          d === 'Regional'  ? "#377eb8" :
//          d === 'Large' ? "#4daf4a" :
//          d === 'Planning' ? "#FF0000" :
//          d === 'Brewpub' ? "#00FF00" :
//          d === 'Contract' ? "#0000FF" :
//          d === 'Other' ? "#000000" :
//                       "#ff7f00";
// }

// Create a legend to display information about our map
var legend = L.control({position: "bottomright"});
colors = ["orange", "violet", "cyan", "red", "green", "blue", "black"]
// When the layer control is added, insert a div with the class of "info legend"
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  labels = [''],
  bType = ['Micro', 'Regional', 'Large', 'Planning', 'Brewpub', 'Contract', 'Other'];

      // Looping through
  for (var i = 0; i < bType.length; i++) {
        div.innerHTML +=
        labels.push(
          // '<i style="background: ' + getColor(bType[i]) + '"></i> ' +
          // (bType[i] ? bType[i] + '<br>' : '+'));
          `<h3 style="background:${colors[i]}">${bType[i]}</h3><br>`
        )}
      div.innerHTML = labels.join('<br>');
  return div;
};
// Add the info legend to the map
legend.addTo(map);

// // Create an overlays object to add to the layer control
var overlays = {
  "Micro": layers.MICRO,
  "Regional": layers.REGIONAL,
  "Large ": layers.LARGE,
  "Planning": layers.PLANNING,
  "Brewpub": layers.BREWPUB,
  "Contract": layers.CONTRACT,
  "Other": layers.OTHER
};

// // Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);


// // Initialize an object containing icons for each layer group
var icons = {
  MICRO: L.ExtraMarkers.icon({
    icon: "ion-beer",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  REGIONAL: L.ExtraMarkers.icon({
    icon: "ion-beer",
    iconColor: "white",
    markerColor: "violet",
    shape: "circle"
  }),
  LARGE: L.ExtraMarkers.icon({
    icon: "ion-beer",
    iconColor: "white",
    markerColor: "cyan",
    shape: "circle"
  }),
  PLANNING: L.ExtraMarkers.icon({
    icon: "ion-hammer",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  BREWPUB: L.ExtraMarkers.icon({
    icon: "ion-beer",
    iconColor: "white",
    markerColor: "green",
    shape: "penta"
  }),
  CONTRACT: L.ExtraMarkers.icon({
    icon: "ion-bookmark",
    iconColor: "white",
    markerColor: "blue",
    shape: "square"
  }),
  OTHER: L.ExtraMarkers.icon({
    icon: "ion-clipboard",
    iconColor: "white",
    markerColor: "black",
    shape: "circle"
  })
};
var url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.json";
d3.json(url, function(response) {
  console.log(response);
  for (var i = 0; i < response.length; i++) {
    var latLocation = response[i].latitude;
    var lonLocation = response[i].longitude;
    var breweryType = response[i].brewery_type;

    if (breweryType === "micro") {
      breweryType = "MICRO";
    }
    else if (breweryType === "regional") {
      breweryType = "REGIONAL";
    }

    else if (breweryType === "large") {
      breweryType = "LARGE";
    }
    else if (breweryType === "planning") {
      breweryType = "PLANNING";
    }
    else if (breweryType === "brewpub") {
      breweryType = "BREWPUB";
    }
    else if (breweryType === "contract") {
      breweryType = "CONTRACT";
    }
    else {breweryType = "OTHER";}

    var newMarker = L.marker([latLocation, lonLocation], {
      icon: icons[breweryType]
    });
    newMarker.addTo(layers[breweryType]);
    
    newMarker.bindPopup("<h3>" + response[i].name + "</h3> <hr> <h3> City: " + response[i].city  + "</h3><h3> Phone: " + response[i].phone + "</h3><h3>" + `<a href="${response[i].website_url}" target="_blank">Website</a>` + "</h3>").addTo(map);

       
  }
})