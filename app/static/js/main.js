;

// global leaflet config
L.Icon.Default.imagePath = STATIC_ROOT + '/img/leaflet';

(function() {

  var mapEl;

  if (mapEl = document.getElementById('main-map')) {
    map = drawMap(mapEl);
    pinAllSchools(map);
  }

  if (mapEl = document.getElementById('school-map')) {
    map = drawMap(mapEl);
    pinSchool(map);
  }

  function getJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function gotGet() {
      if (request.status >= 200 && request.status < 400) {
        data = JSON.parse(request.responseText);
        callback(data);
      } else {
        console.error('GET failed for url ' + url +
                      '; not running callback ' + callback);
      }
    };
    request.send();
  }

  function drawMap(mapEl) {
    var mapOptions = {
      center: [-1.313, 36.788],
      zoom: 15,
      scrollWheelZoom: false
    };
    var map = L.map(mapEl, mapOptions);
    L.tileLayer(STATIC_ROOT + '/tiles/{z}/{x}/{y}.png').addTo(map)
    return map;
  }

  function pinAllSchools(map) {
    function pinPopup(feature, layer) {
      var popupContent = '<h3><a href="/schools/' + feature.slug + '">' +
                         feature.properties.name + '</a></h3>'
      layer.bindPopup(popupContent);
    }
    var url = WEB_ROOT + '/schools.geojson'
    getJSON(url, function pinSchoolsFromData(data) {
      L.geoJson(data, {onEachFeature: pinPopup}).addTo(map);
    });
  }

  function pinSchool(map) {
    var location = school.geometry.coordinates[0].reverse();
    map.setView([location[0] + 0.0003, location[1]], 18);
    L.marker(location).addTo(map);
  }

})();
