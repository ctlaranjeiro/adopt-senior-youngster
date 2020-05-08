/* jshint esversion: 9*/
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Volunteer = require('../models/volunteer');

const uploadCloud = require('../config/cloudinary');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* MIDDLEWARE */
router.use((req, res, next) => {
  if (req.session.currentUser) {
    //what next does here is to redirect the user to the next route on our code --- order matters here! -- it will affect every single thing that it's after this next
    next();
  } else {
    res.redirect('/login');
  }
});

/* GET user page */
router.get('/user/:id', (req, res, next) => {
  try {
    const uid = req.params.id;
    User.findById(uid)
      .populate('volunteer')
      .then(user => {

        res.render('user', { user });
      });
  } catch(e){
    next(e);
  }
});

/* GET volunteer page */
router.get('/volunteer/:id', (req, res, next) => {
  try {
    const vid = req.params.id;
    Volunteer.findById(vid)
      .populate('user')
      .then(volunteer => {

        res.render('volunteer', { volunteer });
      });
  } catch(e){
    next(e);
  }
});

module.exports = router;