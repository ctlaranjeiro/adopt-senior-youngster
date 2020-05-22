
function address() {
  let subjects = document.querySelectorAll('div._id');
  console.log(subjects);
  
  let moradas = [];
  for(let j = 0; j < subjects.length; j ++) {
    
    let id = subjects[j].innerHTML;
    console.log('ID:', id);
    let morada = document.getElementById(id+'morada').innerHTML;
    console.log('Morada:', morada);
    moradas.push(morada);
    // geocode();
    // initMap();
    
  }
   console.log(moradas);
  // let adress;
  for (let i = 0; i < moradas.length; i ++) {
    let address = moradas[i];
    return address;
  }
}

function geocode() {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      adress: address(),
      // key: app.locals.googleMapsKey //NÃO ESTÁ A ASSUMIR
      key: 'AIzaSyDmvhJhg_f-9Tozc1F_XkMOcaHfGCy14Nc'
    }
  })
  .then((res) => {
    console.log(res);
    let formattedAddress = res.data.results[0].formatted_address;
    let latitude = res.data.results[0].reometry.morada.lat;
    let longitude = res.data.results[0].reometry.morada.lng;

    console.log(formattedAddress);

    console.log('lat:', latitude, 'lng:', longitude);

    return {lat: latitude, lng: longitude};
  })
  .catch(err => {
    console.log('error:', err);
  });
}

// geocode();

function initMap() {

  // default map options
  let options = {
    zoom: 12,
    center: {lat: 38.7166700, lng: -9.1333300}
  };

  // set the map
  let map = new google.maps.Map(document.getElementById('map'), options);

  // identifier marker
  let marker = new google.maps.Marker({
    position: geocode(),
    // position: {lat: 38.7166700, lng: -9.1333300},
    map: map
  });
}

initMap();

// subjects.forEach(subject => {
//   let id = subject.innerHTML;
//   console.log('ID:', id);
//   initMap();
// });