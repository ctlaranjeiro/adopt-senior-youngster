document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);
// ====Togling on/off the captions div according to the hamburger menu===

// ==============================================================

// ====Google Maps====
let subject = document.getElementById('activName').innerHTML;
let subjectAddress = document.getElementById('activAdress').innerHTML;

let object = document.getElementById('passivName').innerHTML;
let objectAddress = document.getElementById('passivAddress').innerHTML;


function startMap() {
  let defaultCenter = new google.maps.Geocoder(subjectAddress);

  let options = {
    zoom: 13,
    center: defaultCenter
  };

  const map = new google.maps.Map(document.getElementById('map'), options);

  /*
  let mapProp = {
    center: deafultCenter,
    zoom: 13
  };
  const map = new google.maps.Map(
    document.getElementById('map'), mapProp);
  
  let subjectMarker = new google.maps.Marker({
    position: deafultCenter,
    map: map
  });

  let subjectInfoWindow = new google.maps.InfoWindow({
    content: subject
  });

  marker.addListener('click', function() {
    subjectInfoWindow.open(map, subjectMarker);
  });

  let octMarker = new google.maps.Marker({
    position: new google.maps.Geocoder(ojectAddress),
    map: map
  });

  let objectInfoWindow = new google.maps.InfoWindow({
    content: oject
  });

  marker.addListener('click', function() {
    infoWindow.open(map, objectMarker);
  }); */

}
  
startMap();


// ===================