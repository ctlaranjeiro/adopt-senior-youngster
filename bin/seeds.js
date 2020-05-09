/* jshint esversion: 9*/
const mongoose = require('mongoose');
const User = require('../models/user');
const Volunteer = require('../models/volunteer');
// const Institution = require('../models/institution');
const DB_NAME = 'adopt-senior-youngster';
mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User.collection.drop();
// Volunteer.collection.drop();

const users = [
{
  accountType: 'User',
  email: 'frodo.baggins@hotmail.com',
  password: 'ILoveSam',
  firstName: 'Frodo',
  lastName: 'Baggins',
  gender: 'Other',
  imgPath: '/images/pics/Frodo-Baggins.png',
  birthDate: new Date (1956, 01, 01),
  address: 'Baggs End, Underhill, Shire',
  phoneNumber: 911234567,
  emergencyContact: {
    firstName: 'Sammuel',
    lastName: 'Gamgee',
    phoneNumber: 911234568,
    email: 'samwise@hotmail.com',
    address: 'Baggs End, Underhill, Shire'
  },
  schedulePreference: ['Over Night: 12am - 8am'],
  specificNeeds: ['Displacements']
},
{
  accountType: 'User',
  email: 'aurora.dias@gmail.com',
  password: 'aurora69',
  firstName: 'Aurora',
  lastName: 'Dias',
  gender: 'Female',
  imgPath: '/images/pics/aurora-dias.png',
  birthDate: new Date (1940, 02, 28),
  address: 'Praça Paiva Coiceiro 29 1esq, Lisboa, Portugal',
  phoneNumber: 961234567,
  emergencyContact: {
    firstName: 'Cristina',
    lastName: 'Dias',
    phoneNumber: 961234568,
    email: 'cristina.dias@hotmail.com',
    address: 'Rua dos Clerigos n9 2dir, Porto, Portugal'
  },
  schedulePreference: ['Morning: 8am - 12pm'],
  specificNeeds: ['House Care/Maintnense'],
  assignedVolunteers:[
    {
      _id: Object("5eb6ceb7fc598b2af13c7095") // <----------
    }
]
},
{
  accountType: 'User',
  email: 'rui.mota@hotmail.com',
  password: '125azul',
  firstName: 'Rui',
  lastName: 'Mota',
  gender: 'Male',
  imgPath: '/images/pics/rui-mota.png',
  birthDate: new Date (1980, 03, 13),
  address: 'Rua Carlos Mardel n13 1esq, Lisboa, Portugal',
  phoneNumber: 931234513,
  emergencyContact: {
    firstName: 'Fernando Passos Dias',
    lastName: 'Aguiar',
    phoneNumber: 931234567,
    email: 'fernando.taxista@hotmail.com',
    address: 'Rua Sampaio Bruno n25 1dir, Lisboa, Portugal'
  },
  schedulePreference: ['24 hours'],
  specificNeeds: ['Health Care', 'House Care/Maintnense', 'Displacements', 'Grocery Shopping']
},
{
  accountType: 'User',
  email: 'sementinhadomal@hotmail.com',
  password: 'chichi-coco',
  firstName: 'Dennis',
  lastName: '"The Menace"',
  gender: 'Male',
  imgPath: '/images/pics/dennis-the-menace.png',
  birthDate: new Date (2010, 12, 25),
  address: 'Juvenile center of Lisboa',
  phoneNumber: 216661313,
  emergencyContact: {
    firstName: 'Joe',
    lastName: 'Wilson',
    phoneNumber: 213334445,
    email: 'joe.wilson@hotmail.com',
    address: 'Calçada de Carriche n33 rc, Lisboa, Portugal'
  },
  schedulePreference:[ '24 hours'],
  specificNeeds: ['Pupil (for at-risk youth in need of a mentor)']
}
];

const volunteers = [
  {
  accountType: 'Volunteer',
  email: 'chuck.norris@hotmail.com',
  password: 'walkertxranger',
  firstName: 'Carlos',
  lastName: 'Norris',
  gender: 'Male',
  imgPath: '/images/pics/chuck-norris.png',
  birthDate: new Date (10, 03, 1940),
  address: 'Praça de Alvalade n1 3dir, Lisboa, Portugal',
  volPhoneNumber: 966696969,
  occupation: 'Marcial arts master, Pastor',
  skills: ['Mentor (for at-risk youth in need of a mentor)'],
  availablePeriods: ['24 hours'],
  aboutMe: 'I beleve tha discipline and faith are the way to proper educate and discipline.'
  },
  {
    accountType: 'Volunteer',
    email: 'jason.statham@gmail.com',
    password: 'transporter',
    firstName: 'Jason',
    lastName: 'Statham',
    gender: 'Male',
    imgPath: '/images/pics/jason-statham.png',
    birthDate: new Date (26, 07, 1967),
    address: 'Praça de Alvalade n4 2dir, Lisboa, Portugal',
    volPhoneNumber: 966696970,
    occupation: 'Kick-Boxing fighter, courier, personal driver',
    skills: ['Displacements'],
    availablePeriods: ['24 hours'],
    aboutMe: "I have 3 roules. I don't want to know anything about the package, I drive under the speed limit and I only drive my car."
  },
  {
    accountType: 'Volunteer',
    email: 'mariana.anjos@gmail.com',
    password: 'jesuseocaminho',
    firstName: 'Mariana',
    lastName: 'Anjos',
    gender: 'Female',
    imgPath: '/images/pics/mariana-anjos.jpg',
    birthDate: new Date (16, 07, 1997),
    address: 'Praça de Alvalade n7 2dir, Lisboa, Portugal',
    volPhoneNumber: 966677970,
    occupation: 'nurse',
    skills:[ 'Health Care', 'House Care/Maintnense', 'Grocery Shopping'],
    availablePeriods: ['Afternoon: 12pm - 4pm'],
    aboutMe: "I am a nurse at a hospital. I like to help people."
  },
  {
    accountType: 'Volunteer',
    email: 'optimus.autobots@gmail.com',
    password: 'autobotsrollout',
    firstName: 'Optimus',
    lastName: 'Prime',
    gender: 'Male',
    imgPath: '/images/pics/optimus.png',
    birthDate: new Date (10, 11, 1011),
    address: 'Classified',
    volPhoneNumber: 911011011,
    occupation: 'Leader of the Autobots',
    skills: ['Displacements'],
    availablePeriods: ['24 hours'],
    aboutMe: "I am a leader and a friend."
  },
  {
    accountType: 'Volunteer',
    email: 'vin.diesel@gmail.com',
    password: 'fastandfurious',
    firstName: 'Vin',
    lastName: 'Diesel',
    gender: 'Male',
    imgPath: '/images/pics/vin-diesel.png',
    birthDate: new Date (18, 07, 1967),
    address: 'Praça de Alvalade n17 2dir, Lisboa, Portugal',
    volPhoneNumber: 910000001,
    occupation: 'driver',
    skills: ['Displacements'],
    availablePeriods: ['24 hours'],
    aboutMe: "You ride with me, you are part of my family. And I'm all about family."
  },
  {
    accountType: 'Volunteer',
    email: 'miyagisun@gmail.com',
    password: 'waxonwaxoff',
    firstName: 'Pat',
    lastName: 'Morita',
    gender: 'Male',
    imgPath: '/images/pics/kesuke-miyagi.png',
    birthDate: new Date (28, 06, 1932),
    address: 'Praça de Alvalade n37 rc, Lisboa, Portugal',
    volPhoneNumber: 912692469,
    occupation: 'janitor',
    skills: ['Mentor (for at-risk youth in need of a mentor)'],
    availablePeriods: ['Afternoon: 12pm - 4pm'],
    aboutMe: "We should never fight. But if we must fight, we fight to win."
  }
];

// const institutions = [
//   {
//     accountType: 'Institution',
//     email: 'holyhouseofpoorsouls@gmail.com',
//     password: 'hhops2000',
//     name: 'Holy House Of Poor Souls',
//     institutionType: 'Social Support',
//     adress: 'Largo dos Prazers n1, Lisboa, Portugal',
//     phoneNumber: 216699669
//   }
// ];

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
});

// Volunteer.create(volunteers, err => {
//   if (err) {
//     throw err;
//   }
//   console.log(`Created ${volunteers.length} voluntees`);
//   mongoose.connection.close();
// });

// Institution.create(institutions, err => {
//   if(err) {
//     throw err;
//   }
//   console.log(`Created ${institutions.length} institutions`);
//   mongoose.connection.close();
// });