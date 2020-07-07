var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.json";

d3.json(url, function(response) {

  console.log(response);

  //create array 
  var heatArray = [];
console.log(heatArray);
  for (var i = 0; i < response.length; i++) {
    var latLocation = response[i].latitude;
    var lonLocation = response[i].longitude;

    if (latLocation, lonLocation) {
      heatArray.push([latLocation, lonLocation]);
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 15,
    blur: 1,
    minOpacity:0.2
  }).addTo(myMap);

});


