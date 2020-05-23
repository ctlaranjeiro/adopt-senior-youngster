require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const helpers      = require('handlebars-helpers')();
hbs.registerHelper(helpers);
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);


// hbs.registerHelper('isChecked', (checkboxOption, userList) => {
//   for (let i = 0; i<userList.length; i++) {
//     //console.log('schdule i', userList[i]);
//     if (checkboxOption === userList[i]) {
//       //console.log('found!');
//       return 'checked';
//     } else {
//       return '';
//     }
//   }
// });

hbs.registerHelper('isChecked', (checkboxOption, userList) => {
  let isChecked = '';
  //console.log(userList);
  userList.forEach((element) => {
    if (element === checkboxOption) {
      //console.log('HERE!!!');
      return (isChecked = 'checked');
    }
  });
  return isChecked;
});

// CUSTOM HELPERS FOR USER-EDIT
hbs.registerHelper('isEqual', (value1, value2) => {
  if(value1 === value2){
    return `<li>${value1}</li>`;
  }
});

// CUSTOM HELPERS FOR USER PAGE - DISPLAY REPORTS FROM VOLUNTEER
hbs.registerHelper('matches', (value1, value2) => {
  // console.log('valu1', value1);
  // console.log('valu2', value2);
  if(value1.toString() === value2.toString()){
    // console.log('found');
    return true;
  } else{
    return false;
  }
});

// CUSTOM HELPERS FOR USER PAGE - DISPLAY REPORTS DATE with specific format
hbs.registerHelper('date', (value) => {
  const date = new Date(value);
  // console.log('DATE:',date);

  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
  const [
    { value: month },,{ value: day },,{ value: year }] 
    = dateTimeFormat.formatToParts(date); 

  // console.log(`${day}-${month}-${year}`);

  return `${month} ${day}, ${year}`;
});



//local connection
//'mongodb://localhost/adopt-senior-youngster'
//heroku connection
//process.env.MONGODB_URI
mongoose
  .connect('mongodb://localhost/adopt-senior-youngster', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup authentication session
app.use(session({
  secret: 'adopt-senior-youngster-secret',
  cookie: { maxAge: 1000000 } , /* 5min - 300000*/
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    resave: true,
    saveUninitialized: false,
    ttl: 24 * 60 * 60
  })
}));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(__dirname + '/views/partials');

// default value for title local
app.locals.title = 'adopt-senior-youngster';
app.locals.googleMapsKey = process.env.GOOGLEMAPS_API_KEY;


const auth = require('./routes/auth');
app.use('/', auth);


const index = require('./routes/index');
app.use('/', index);


module.exports = app;