// EXAMPLE FOR ADDING A MARKER:
// addMarker({
//   coords: {lat: 38.7166700, lng: -9.1333300},
//   content: '<p>Lisbon</p>'
// });

// function addMarker(props) {
//   let marker = new google.maps.Marker ({
//     position: props.coords,
//     map: map
//   });

//   // Shows an infowindow if the parameter is passed( could be the name of the person)
//   if(props.content) {
//     let infoWindow = mew google.maps.InfoWindow({
//       content: props.content
//     });

//     marker.addListener('click',function(){
//       infoWindow.open(map, marker);
//     });
//   }
// }

function initMap() {

  // DEFAULT MAP OPTIONS:
  let options = {
    zoom: 12,
    center: {lat: 38.7166700, lng: -9.1333300}
  };

  // SET THE MAP:
  let map = new google.maps.Map(document.getElementById('map'), options);

  // SET IDENTIFYER MARKER:
  // addMarker();   -----> chama o marker que recebe as coords da geocode()
  let marker = new google.maps.Marker({
    position: geocode(),
    // position: {lat: 38.7166700, lng: -9.1333300},
    map: map
  });
}

initMap();


// TO GET THE COORDENATES THROUGH THE ADDRESS:
function geocode() { 
let subjects = document.querySelectorAll('div._id');

for (let j = 0; j < subjects.length; j ++) {
  let id = subjects[j].innerHTML;

  let location = document.getElementById(id + 'morada').innerHTML;
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: location,
      // key: app.locals.googleMapsKey //NÃO ESTÁ A ASSUMIR
      key: 'AIzaSyDmvhJhg_f-9Tozc1F_XkMOcaHfGCy14Nc'
    }
  })
  .then((res) => {
    console.log('geocode address param:', params.address);
    console.log(res);
    let formattedAddress = res.data.results[0].formatted_address;
    let latitude = res.data.results[0].geometry.morada.lat;
    let longitude = res.data.results[0].geometry.morada.lng;

    let geometry = {
      address: formattedAddress,
      coords: {
        lat: latitude,
        lng: longitude
      }
    };

    console.log(formattedAddress);

    console.log('lat:', latitude, 'lng:', longitude);

    console.log('geo:', geometry);

    return geometry;
  })
  .catch(err => {
    console.log('error:', err);
  });
}
}