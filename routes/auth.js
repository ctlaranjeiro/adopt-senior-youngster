const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//const User = require('../models/user');

/* GET sign up page */
router.get('/signup', (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch(e){
    next(e);
  }
});

/* GET user sign up page */
router.get('/signup/user', (req, res, next) => {
  try {
    res.render('auth/user-signup');
  } catch(e){
    next(e);
  }
});

/* GET volunteer sign up page */
router.get('/signup/volunteer', (req, res, next) => {
  try {
    res.render('auth/volunteer-signup');
  } catch(e){
    next(e);
  }
});

/* GET login page */
router.get('/login', (req, res, next) => {
  try {
    res.render('auth/login');
  } catch(e){
    next(e);
  }
});





module.exports = router;