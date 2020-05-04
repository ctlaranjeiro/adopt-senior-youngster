/* jshint esversion: 9*/
const mongoose = require('mongoose');
const User = require('../models/user');
const Volunteer = require('../models/volunteer');
const Institution = require('../models/institution');
const DB_TITLE = 'adopt-senior-youngster';
mongoose.connect(`mongodb://localhost/${DB_TITLE}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const users = [
{
  accountType: 'User',
  email: 'frodo.baggins@hotmail.com',
  password: 'IloveSam',
  firstName: 'Frodo',
  lastName: 'Baggins',
  gender: 'Other',
  avatarUrl: '/public/images/pics/Frodo-Baggins.png',
  birthDate: 1956-01-01,
  address: 'Baggs End, Underhill, Shire',
  phoneNumber: 911234567,
  emergencyContact: {
    firstName: 'Sammuel',
    lastName: 'Gamgee',
    phoneNumber: '911234568',
    email: 'samwise@hotmail.com',
    address: 'Baggs End, Underhill, Shire'
  },
  schedulePreference: 'Over Night: 12am - 8am',
  specificNeeds: ['Dislocations']
},
{
  accountType: 'User',
  email: 'aurora.dias@gmail.com',
  password: 'aurora69',
  firstName: 'Aurora',
  lastName: 'Dias',
  gender: 'Female',
  avatarUrl: '/public/images/pics/aurora-dias.png',
  birthDate: 1950-02-28,
  address: 'Praça Paiva Coiceiro 29 1esq, Lisboa, Portugal',
  phoneNumber: 961234567,
  emergencyContact: {
    firstName: 'Cristina',
    lastName: 'Dias',
    phoneNumber: 961234568,
    email: 'cristina.dias@hotmail.com',
    address: 'Rua dos Clerigos n9 2dir, Porto, Portugal'
  },
  schedulePreference: 'Morning: 8am - 12pm',
  specificNeeds: ['House Care/Maintnense']
},
{
  accountType: 'User',
  email: 'rui.mota@hotmail.com',
  password: '125azul',
  firstName: 'Rui',
  lastName: 'Mota',
  gender: 'Male',
  avatarUrl: '/public/images/pics/rui-mota.png',
  birthDate: 1980-03-13,
  address: 'Rua Carlos Mardel n13 1esq, Lisboa, Portugal',
  phoneNumber: 931234513,
  emergencyContact: {
    firstName: 'Fernando Passos Dias',
    lastName: 'Aguiar',
    phoneNumber: 931234567,
    email: 'fernando.taxista@hotmail.com',
    address: 'Rua Sampaio Bruno n25 1dir, Lisboa, Portugal'
  },
  schedulePreference: '24 hours',
  specificNeeds: ['Health Care', 'House Care/Maintnense', 'Dislocations', 'Grocery Shopping']
},
{
  accountType: 'User',
  email: 'sementinhadomal@hotmail.com',
  password: 'chichi-coco',
  firstName: 'Dennis',
  lastName: '"The Menace"',
  gender: 'Male',
  avatarUrl: '/public/images/pics/dennis.png',
  birthDate: 2010-12-25,
  address: 'Juvenile center of Lisboa',
  phoneNumber: 216661313,
  emergencyContact: {
    firstName: 'Joe',
    lastName: 'Wilson',
    phoneNumber: 213334445,
    email: 'joe.wilson@hotmail.com',
    address: 'Calçada de Carriche n33 rc, Lisboa, Portugal'
  },
  schedulePreference: '24 hours',
  specificNeeds: ['Pupil (for at-risk youth in need of a mentor)']
}
];
const volunteers = [
  {
  accountType: 'Volunteer',
  email: 'chuck.norris',
  password: 'walkertxranger',
  firstName: 'Carlos',
  lastName: 'Norris',
  gender: 'Male',
  avatarUrl: '/public/images/pics/chuck-norris.png',
  birthDate: 10-03-1940,
  address: 'Praça de Alvalade n1 3dir, Lisboa, Portugal',
  phoneNumber: 966696969,
  occupation: 'Marcial arts master, Pastor',
  skills: 'Mentor (for at-risk youth in need of a mentor)',
  availablePeriods: '24 hours',
  aboutMe: 'I beleve tha discipline and faith are the way to proper educate and '
  }
];