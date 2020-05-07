const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary.js');

const User = require('../models/user');

/* GET sign up page */
router.get('/signup', (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch (e) {
    next(e);
  }
});

/* GET user sign up page */
router.get('/signup/user', (req, res, next) => {
  try {
    res.render('auth/user-signup');
  } catch (e) {
    next(e);
  }
});

/* GET volunteer sign up page */
router.get('/signup/volunteer', (req, res, next) => {
  try {
    res.render('auth/volunteer-signup');
  } catch (e) {
    next(e);
  }
});


/* GET login page */
router.get('/login', (req, res, next) => {
  try {
    res.render('auth/login');
  } catch (e) {
    next(e);
  }
});

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


/* POST login */
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Add fallbacks
  if (!email || !password){
    res.render('auth/login', {
      errorMessage: 'Please enter both email and password to login'
    });
    return;
  }

  User.findOne({ 'email': email })
    .then(user => {

      // Check if the user exists
      if(!user){
        res.render('auth/login', {
          errorMessage: "The email doesn't exist."
        });
      }

      //compare the password with the one in the database
      if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        const userId = user._id;
        res.redirect(`/user/${userId}`);
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect email or password'
        });
      }
    });
});



/* POST signUp User */
router.post('/signup/user', uploadCloud.single('photo'), (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      birthDate,
      address,
      phoneNumber,
      //schedule preferences
      morning,
      afternoon,
      evening,
      night,
      overNight,
      fullDay,
      //specific needs
      healthCare,
      houseCare,
      displacements,
      grocery,
      pupil,
      emergFirstName,
      emergLastName,
      emergPhoneNumber,
      emergEmail,
      emergAddress
    } = req.body;

    // console.log(`Schedule Preferences: 
    // - Morning: ${morning},
    // - Afternoon: ${afternoon},
    // - Evening: ${evening},
    // - Night: ${night},
    // - Over Night: ${overNight},
    // - 24 Hours: ${fullday}`
    // );

    // console.log(`Specific Needs: 
    // - Health Care: ${healthCare},
    // - House Care: ${houseCare},
    // - Displacements: ${displacements},
    // - Grocery: ${grocery},
    // - Pupil: ${pupil}`
    // );

    // ---- CHECKBOX VALUES 
    const schedulePreference = [];

    if (morning) {
      schedulePreference.push(morning);
    }
    if (afternoon) {
      schedulePreference.push(afternoon);
    }
    if (evening) {
      schedulePreference.push(evening);
    }
    if (night) {
      schedulePreference.push(night);
    }
    if (overNight) {
      schedulePreference.push(overNight);
    }
    if (fullDay) {
      schedulePreference.push(fullDay);
    }

    const specificNeeds = [];

    if (healthCare) {
      specificNeeds.push(healthCare);
    }
    if (houseCare) {
      specificNeeds.push(houseCare);
    }
    if (displacements) {
      specificNeeds.push(displacements);
    }
    if (grocery) {
      specificNeeds.push(grocery);
    }
    if (pupil) {
      specificNeeds.push(pupil);
    }

    // console.log(`Schedule preference: ${schedulePreference}`);
    // console.log(`Specific needs: ${specificNeeds}`);

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const imgPath = req.file.url;
    const imgName = req.file.originalname;

    const newUser = new User({
      email,
      password: hashPass,
      firstName,
      lastName,
      gender,
      birthDate,
      address,
      phoneNumber,
      emergencyContact: {
        firstName: emergFirstName,
        lastName: emergLastName,
        phoneNumber: emergPhoneNumber,
        email: emergEmail,
        address: emergAddress
      },
      schedulePreference: schedulePreference,
      specificNeeds: specificNeeds,
      imgPath,
      imgName
    });


    User.findOne({'email': email})
      .then(user => {
        if (user) {
          res.render('auth/user-signup', {
            emailErrorMessage: 'Email already registered.'
          });
          return;
        }

        if(!morning && !afternoon && !evening && !night && !overNight && !fullDay){
          res.render('auth/user-signup', {
            checkboxErrorMessage: 'Select at least one from the above.'
          });
          return;
        }

        if(!healthCare && !houseCare && !displacements && !grocery && !pupil){
          res.render('auth/user-signup', {
            checkboxErrorMessage: 'Select at least one from the above.'
          });
          return;
        }

        newUser.save()
          .then(user => {
            res.redirect("/login");
          })
          .catch(err => {
            console.log('An error occurred while saving user to DB:', err);
          });
      });
  } catch (e) {
    next(e);
  }
});
/* --------------- END of post signup user */




module.exports = router;