/* jshint esversion: 9*/
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Volunteer = require('../models/volunteer');

const uploadCloud = require('../config/cloudinary');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

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

//---------------- USER PAGE

/* GET user page */
router.get('/user/:id', (req, res, next) => {
  try {
    const uid = req.params.id;
    User.findById(uid)
      .populate('assignedVolunteers')
      .then(user => {
        res.render('user', { user });
      });
  } catch(e){
    next(e);
  }
});

/* GET user edit page */
router.get('/user/:id/edit', (req,res, next) => {
  const uid = req.params.id;

  User.findById(uid)
    // .populate('assignedVolunteers')
    // .then(user => {
    //   Volunteer.find().then(volunteers => {
    //     //console.log('Volunteers: ', volunteers);
    //     res.render('user-edit', { user, volunteers });
    //   });
    .then(user => {
      Volunteer.find({isHelping: false})
        .then(volunteers => {
        console.log('Volunteers result: ', volunteers);
        
        //check for matching needs/skills
        let needsMatchingVolunteers = [];

        volunteers.forEach(volunteer => {
          for (let i = 0; i < user.specificNeeds.length; i++){
            for (let j = 0; j < volunteer.skills.length; j++){
              if(user.specificNeeds[i] === volunteer.skills[j]){
                if(!needsMatchingVolunteers.includes(volunteer)){
                  needsMatchingVolunteers.push(volunteer);
                }
              }
            }
          }
        });

        //check for matching schedule/availability based on the needs already matched
        let finalMatchVolunteers = [];

        needsMatchingVolunteers.forEach(volunteer => {
          for (let i = 0; i < user.schedulePreference.length; i++){
            for (let j = 0; j < volunteer.availablePeriods.length; j++){
              if(user.schedulePreference[i] === volunteer.availablePeriods[j]){
                if(!finalMatchVolunteers.includes(volunteer)){
                  finalMatchVolunteers.push(volunteer);
                }
              }
            }
          }
        });
        

        res.render('user-edit', { user, volunteers: finalMatchVolunteers });
      });
    })
    .catch(err => {
      next(err);
    });
});

/*POST update user details*/
router.post('/user/:id/:action', uploadCloud.single('photo'), (req,res, next) => {
  const uid = req.params.id;
  const action = req.params.action;

  const {
    //personal details
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
    //schedule preferences
    morning,
    afternoon,
    evening,
    night,
    overNight,
    fullDay,
    //needs
    healthCare,
    houseCare,
    displacements,
    grocery,
    pupil,
    //emergency contact
    emergFirstName,
    emergLastName,
    emergPhoneNumber,
    emergEmail,
    emergAddress,
    password
  } = req.body;

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

  if(action === 'updatePersonalDetails'){
    User.updateOne({ _id: uid }, { $set: { 
      firstName,
      lastName,
      email,
      address,
      phoneNumber
    }})
      .then(user => {
        console.log('User personal details updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user personal details in DB:', err);
      });
  }

  if(action === 'updateSchedule'){
    User.updateOne({ _id: uid }, { $set: { 
      schedulePreference: schedulePreference
    }})
      .then(user => {
        console.log('User schedule preferences updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user schedule preferences in DB:', err);
      });
  }

  if(action === 'updateNeeds'){
    User.updateOne({ _id: uid }, { $set: { 
      specificNeeds: specificNeeds
    }})
      .then(user => {
        console.log('User specific needs updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user specific needs in DB:', err);
      });
  }

  if(action === 'updateEmergContact'){
    User.updateOne({ _id: uid }, { $set: { 
      emergencyContact: {
        firstName: emergFirstName,
        lastName: emergLastName,
        phoneNumber: emergPhoneNumber,
        email: emergEmail,
        address: emergAddress
      }
    }})
      .then(user => {
        console.log('User emergency contact updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user emergency contact details in DB:', err);
      });
  }

  if(action === 'uploadPhoto'){
    const imgPath = req.file.url;
    const imgName = req.file.originalname;

    User.updateOne({ _id: uid }, { $set: { imgPath, imgName }})
      .then(user => {
        console.log('User profile picture uploaded!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user profile picture in DB:', err);
      });
  }
  
  if(action === 'changePassword'){
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.updateOne({ _id: uid }, { $set: { password: hashPass }})
      .then(user => {
        console.log('User password updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user password in DB:', err);
      });
  }

});

/* DELETE user account */
router.post('/user/:id/delete', (req,res, next) => {
  const uid = req.params.id;

  req.session.destroy(() => {
    User.deleteOne({ _id: uid })
      .then(result => {
        console.log('User deleted: ', result);
        res.redirect('/');
      })
      .catch (err => {
        console.log('An error occurred while deleting user from DB: ', err);
      });
  });
  
});







//---------------- VOLUNTEER PAGE

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