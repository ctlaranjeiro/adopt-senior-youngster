let subject = document.querySelectorAll('li.column');
// let lastName = document.getElementById('_id').innerHTML;

// let subject = document.getElementById(`${lastName}`);
console.log(subject);

function geocode() {
  let theName = document.getElementById('theName').innerHTML;
  console.log('o nome:', theName);

  let location = document.getElementById(`${theName}`).innerHTML;
  console.log('location:', location);
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      adress: location,
      key: process.env.GOOGLEMAPS_API_KEY
    }
  })
  .then((res) => {
    console.log(res);
    let formattedAddress = res.data.results[0].formatted_address;
    let latitude = res.data.results[0].reometry.location.lat;
    let longitude = res.data.results[0].reometry.location.lng;

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
    map: map
  });
}

// initMap();

for(let j = 0; j < subject.length; j ++) {
  subject[j].addEventListener('click', () => {
    let name = document.subject[j].getElementById('theName').innerHTML;
    console.log('subject name:', name);
    // console.log('subject adress:',subject[j].childNodes[5].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[7].textContent.split('Address: ')[1]);
    // console.log('subject adress:',subject[j].childNodes[5][1][1][1][1][5][3][1][7].textContent.split('Address: ')[1]);
    initMap();
  });
}