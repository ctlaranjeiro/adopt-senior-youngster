/* jshint esversion: 9*/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uploadCloud = require('../config/cloudinary');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const { check, validationResult } = require('express-validator');

const User = require('../models/user');
const Volunteer = require('../models/volunteer');
const Review = require('../models/review');
const Report = require('../models/report');


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
      .populate('reports')
      .populate('reports.')
      .then(user => {
        res.render('user', { user });
      });
  } catch(e){
    next(e);
  }
});

/* POST user submit rating */
router.post('/user/:id/submit-ratting', (req, res, next) => {
  const uid = req.params.id;

  const {
    subject,
    rate,
    review
  } = req.body;

  // console.log('Rated Volunteer id:', subject);
  // console.log('Rate', rate);
  // console.log('Review:', review);

  const vid = subject;

  const userObjectId = mongoose.Types.ObjectId(uid);
  const volunteerObjectId = mongoose.Types.ObjectId(vid);

  

  const newReview = new Review({
    rate: rate,
    author: userObjectId,
    subject: volunteerObjectId,
    text: review,
  });

  Review.findOne({ $and: [{ 'author': userObjectId }, { 'subject': volunteerObjectId}] })
    .then(reviewFromDB => {
      if(reviewFromDB){
        Review.updateOne({ $and: [{ 'author': userObjectId }, { 'subject': volunteerObjectId}] }, { $set: { 
          rate: rate, 
          text: review
        }})
          .then(result => {
            res.redirect(`/user/${uid}`);
          })
          .catch(err =>{
            console.log('Error while updating review on DB', err);
          });
      } else{
        newReview.save()
          .then(review => {
            console.log('New Review saved:', review);

            const volunteerId = review.subject;
            const reviewId = review._id;
            const reviewObjectId = mongoose.Types.ObjectId(reviewId);
            const newRate = review.rate;

            function average(array){
              const reducer = (accumulator, currentValue) => accumulator + currentValue;
              const sum = array.reduce(reducer);

              const avg = sum/array.length;

              return avg;
            }

            Volunteer.findById(volunteerId)
              .then(volunteer => {
                if(!volunteer.evaluation){
                  Volunteer.updateOne({ _id: volunteerId }, { $set: { 
                    evaluation: {
                      rates: newRate,
                      reviews: reviewObjectId
                    }
                  }})
                    .then(result => {
                      console.log('volunteer reviews updated! Result:', result);
      
                      Volunteer.findById(volunteerId)
                        .then(volunteer => {
                          console.log('Volunteer in DB after rates', volunteer);
      
                          const rates = volunteer.evaluation.rates;
                          console.log('Rates in volunteer DB:', rates);
                          const avgRate = average(rates);
                          
                          Volunteer.updateOne({ _id: volunteerId }, { $set: { 
                            'evaluation.averageRate': avgRate
                          }})
                            .then(result =>{
                              console.log('Average rate of volunteer result:', result);
                              res.redirect(`/user/${uid}`);
                            })
                            .catch(err => {
                              console.log('Error while updating average rate of volunteer in DB', err);
                            });
                        })
                        .catch(err => {
                          console.log('Error while finding volunteer in DB', err);
                        });
                    })
                    .catch(err => {
                      console.log('Error while updating reviews in volunteer', err);
                    });
                }else{
                  Volunteer.updateOne({ _id: volunteerId }, { $push: { 
                    'evaluation.rates': newRate,
                    'evaluation.reviews': reviewObjectId
                  }})
                    .then(result => {
                      console.log('volunteer reviews updated! Result:', result);
      
                      Volunteer.findById(volunteerId)
                        .then(volunteer => {
                          console.log('Volunteer in DB after rates', volunteer);
      
                          const rates = volunteer.evaluation.rates;
                          console.log('Rates in volunteer DB:', rates);
                          const avgRate = average(rates);
                          
                          Volunteer.updateOne({ _id: volunteerId }, { $set: { 
                            'evaluation.averageRate': avgRate
                          }})
                            .then(result =>{
                              console.log('Average rate of volunteer result:', result);
                              res.redirect(`/user/${uid}`);
                            })
                            .catch(err => {
                              console.log('Error while updating average rate of volunteer in DB', err);
                            });
                        })
                        .catch(err => {
                          console.log('Error while finding volunteer in DB', err);
                        });
                    })
                    .catch(err => {
                      console.log('Error while updating reviews in volunteer', err);
                    });
                }
              })
              .catch(err => {
                console.log('Error while retrieving volunteer from DB', err);
              });
          })
          .catch(err => {
            console.log('Error while saving review to DB', err);
          });
      }
    })
    .catch(err => {
      console.log('Error finding review on DB', err);
    });

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
    .populate('assignedVolunteers')
    .then(user => {      
      Volunteer.find()
        .then(volunteers => {
        //console.log('Volunteers result: ', volunteers);
        
        //check if volunteer is already assigned to user        
        let volNotAssigned = [];

        volunteers.forEach(volunteer => {
          if(!volunteer.assignedUsers.includes(user.id)){
            volNotAssigned.push(volunteer);
          }
        });

        //console.log('volNotAssigned', volNotAssigned);


        //check for matching needs/skills
        let needsMatchingVolunteers = [];

        volNotAssigned.forEach(volunteer => {
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

        

        res.render('user-edit', { user, volunteers: finalMatchVolunteers});
      });
    })
    .catch(err => {
      next(err);
    });
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

/*POST update user details*/
router.post('/user/:id/:action', uploadCloud.single('photo'), [
  check('firstName', 'First name must be filled')
    .not().isEmpty(),
  check('lastName', 'Last name must be filled')
    .not().isEmpty(),
  check('email')
    //.not().isEmpty().withMessage('Email is empty')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  check('address', 'Address must be filled')
    .not().isEmpty(),
  check('phoneNumber')
    //.not().isEmpty().withMessage('Phone number must be filled')
    .isMobilePhone('pt-PT').withMessage('Phone number must have 9 digits'),
  //---------- EMERGENCY CONTACT INFO
  check('emergFirstName', `Emergency contact's first name must be filled`)
    .not().isEmpty(),
  check('emergLastName', `Emergency contact's last name must be filled`)
    .not().isEmpty(),
  check('emergPhoneNumber')
    .isMobilePhone('pt-PT').withMessage(`Emergency contact's phone number must have 9 digits`),
  check('emergEmail')
    .isEmail().withMessage(`Emergency contact's invalid email`)
    .normalizeEmail(),
  check('emergAddress', `Emergency contact's address must be filled`)
    .not().isEmpty(),
  check('password', 'Minimum length of 6 characters')
  .isLength({ min: 6 })
], async (req,res, next) => {
  const uid = req.params.id;
  const action = req.params.action;

  const errorsResult = validationResult(req);
  const errors = errorsResult.errors;
  

  let userObject;

  try {
    userObject = await User.findById(uid)
    .populate('assignedVolunteers');
  } catch {
    console.log('error fetching user');
  }

  //console.log('USER OBJECT:',userObject);

  let allVolunteersObject;

  try {
    allVolunteersObject = await Volunteer.find()
  } catch {
    console.log('error fetching volunteers');
  }

  

  const {
    //personal details
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
    userNotes,
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
    password,
    assignedVolunteer,
    volunteer
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
    // console.log('ERRORS RESULT:',errorsResult);
    errorsResult.errors.splice(-6, 6);
    // console.log('ERRORS RESULT:',errorsResult);

    if(!errorsResult.isEmpty()){
      res.render('user-edit', {
        user: userObject,  
        volunteers: allVolunteersObject,
        errors: errors
      });
    } else{
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
  }

  if(action === 'updateUserNotes'){
    User.updateOne({ _id: uid }, { $set: { 
      notes: userNotes
    }})
      .then(user => {
        console.log('User notes updated!');
        res.redirect(`/user/${uid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating user notes in DB:', err);
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
    //console.log('ERRORS RESULT:',errorsResult);
    errorsResult.errors.splice(0, 5);
    errorsResult.errors.pop();
    // console.log('ERRORS RESULT:',errorsResult);

    if(!errorsResult.isEmpty()){      
      res.render('user-edit', {
        user: userObject,  
        volunteers: allVolunteersObject,
        errors: errors
      });
    } else{
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
    // console.log('ERRORS RESULT:',errorsResult);
    errorsResult.errors.splice(0, 10);
    // console.log('ERRORS RESULT:',errorsResult);

    if(!errorsResult.isEmpty()){
      res.render('user-edit', {
        user: userObject,  
        volunteers: allVolunteersObject,
        errors: errors
      });
    } else{
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.updateOne({ _id: uid }, { $set: { password: hashPass }})
          .then(user => {
            //console.log('USER',uid)
            console.log('User password updated!');
            res.redirect(`/user/${uid}/edit`);
          })
          .catch(err => {
            console.log('Error while updating user password in DB:', err);
          });
    }
  }
  
  if(action === 'deleteAssignedVolunteer'){
    console.log('req.body assignedVolunteer for delete', assignedVolunteer);

    const userObjectId = mongoose.Types.ObjectId(uid);

    let deleteSelected = [];

    if(typeof assignedVolunteer === 'string'){
      let objectId = mongoose.Types.ObjectId(assignedVolunteer);
      deleteSelected.push(objectId);
    } else{
      assignedVolunteer.forEach(element => {
        let objectId = mongoose.Types.ObjectId(element);
        deleteSelected.push(objectId);
      });
    }

    deleteSelected.forEach(objectId => {
      //console.log('Object Id for delete: ', objectId);

      Volunteer.updateOne({ _id: objectId }, { $pull: {
        assignedUsers: { $in: [ userObjectId ] }
      }})
        .then(result => {
          //console.log('VOLUNTEER UPDATE RESULT',result);

          User.updateOne({ _id: uid }, { $pull: {
            assignedVolunteers: { $in: [ objectId ] }
          }})
            .then(result => {
              //console.log('USER UPDATE RESULT',result);

              Volunteer.find({ _id: objectId })
                .then(volunteer => {
                  //console.log('VOLUNTEER RESULT ON FIND:',volunteer);
                  //console.log('VOLUNTEER ASSIGNED USERS', volunteer[0].assignedUsers);
                  //console.log('volunteer[0].assignedUsers LENGTH', volunteer[0].assignedUsers.length)

                  if(volunteer[0].assignedUsers.length === 0){
                    Volunteer.updateOne({ _id: objectId }, { $set: { 
                      isHelping: false
                    }})
                      .then(result => {
                        //console.log('VOLUNTEER IS HELPING SET TO FALSE');
                        
                        User.find({ _id: uid })
                          .then(user => {
                            //console.log('USER RESULT ON FIND:', user);
                            //console.log('USER ASSIGNED USERS', user[0].assignedVolunteers);
                            //console.log('user[0].assignedVolunteers LENGTH', user[0].assignedVolunteers.length);

                            if(user[0].assignedVolunteers.length === 0){
                              User.updateOne({ _id: uid }, { $set: { 
                                hasHelp: false
                              }})
                                .then(result => {
                                  res.redirect(`/user/${uid}/edit`);
                                })
                                .catch(err => {
                                  console.log('Error while updating user hasHelp', err);
                                });
                            } else{
                              res.redirect(`/user/${uid}/edit`);
                            }
                          });
                      });
                  } else{
                    User.find({ _id: uid })
                      .then(user => {
                        //console.log('USER RESULT ON FIND:', user);
                        //console.log('USER ASSIGNED USERS', user[0].assignedVolunteers);
                        //console.log('user[0].assignedVolunteers LENGTH', user[0].assignedVolunteers.length);

                        if(user[0].assignedVolunteers.length === 0){
                          User.updateOne({ _id: uid }, { $set: { 
                            hasHelp: false
                          }})
                            .then(result => {
                              res.redirect(`/user/${uid}/edit`);
                            })
                            .catch(err => {
                              console.log('Error while updating user hasHelp', err);
                            });
                        } else{
                          res.redirect(`/user/${uid}/edit`);
                        }
                      });
                  }
               });
            });
        })
        .catch(err => {
          console.log('Error while updating volunteer - pull user ObjectId from assignedUsers', err);
        })
      });
  }
   

  if(action === 'assignVolunteers'){
    console.log('req.body volunteer:', volunteer);
    console.log(typeof volunteer);

    let selectedVolunteers = [];

    if(typeof volunteer === 'string'){
      let objectId = mongoose.Types.ObjectId(volunteer);
      selectedVolunteers.push(objectId);
    } else{
      volunteer.forEach(element => {
        let objectId = mongoose.Types.ObjectId(element);
        selectedVolunteers.push(objectId);
      });
    }

    //console.log('selectedVolunteers ObjectId:', selectedVolunteers);

    //push assigned volunteers to users' assingedVolunteers key
    User.updateOne({ _id: uid }, { $push: { 
      assignedVolunteers: selectedVolunteers
    }})
      .then(user => {
        console.log('User assigned volunteers updated with push')
        //set users' hasHelp to true
        User.updateOne({ _id: uid }, { $set: { 
          hasHelp: true
        }})
          .then(user => {
            console.log('User hasHelp updated!');

            //set isHelping to true, on selected volunteers
            selectedVolunteers.forEach(objectId => {
              Volunteer.updateOne({ _id: objectId }, { $set: { 
                isHelping: true
              }})
                .then(volunteer => {
                  console.log('volunteer ishelping set to true');
                  
                  let userObjectId = mongoose.Types.ObjectId(uid);

                  //push user ID to volunteer assigned users
                  Volunteer.updateOne({ _id: objectId }, { $push: {
                    assignedUsers: userObjectId
                  }})
                    .then(volunteer => {
                      console.log('volunteer assignedUsers updated with userObjectId');
                    })
                    .catch(err => {
                      console.log('error while assigning user to volunteer');
                    });
                  
                })
                .catch(err => {
                  console.log('error while updating isHelping in volunteer DB', err);
                });
            });

            res.redirect(`/user/${uid}/edit`);
          });
      })
      .catch(err => {
        console.log('Error while updating user assigned volunteers in DB:', err);
      });
  }

});


//---------------- VOLUNTEER PAGE

/* GET volunteer page */
router.get('/volunteer/:id', (req, res, next) => {
  try {
    const vid = req.params.id;
    Volunteer.findById(vid)
      .populate('assignedUsers')
      .then(volunteer => {
        res.render('volunteer', { volunteer });
      });
  } catch(e){
    next(e);
  }
});


/* GET volunteer edit page */
router.get('/volunteer/:id/edit', (req, res, next) => {
  const vid = req.params.id;

  Volunteer.findById(vid)
    .populate('assignedUsers')
    .then(volunteer => {
      res.render('volunteer-edit', {volunteer});
    })
    .catch(err => {
      next(err);
    });
});

/* POST volunteer submit report */
router.post('/volunteer/:id/submit-report', (req, res, next) => {
  const vid = req.params.id;
  
  const {
    user,
    report
  } = req.body;

  const uid = user;

  const volunteerObjectId = mongoose.Types.ObjectId(vid);
  const userObjectId = mongoose.Types.ObjectId(uid);

  const newReport = new Report({
    author: volunteerObjectId,
    subject: userObjectId,
    text: report
  });

  Report.findOne({ $and: [{ 'author': volunteerObjectId }, { 'subject': userObjectId}] })
    .then(reportFromDB => {
      //console.log('report from DB: ', reportFromDB);
      if(reportFromDB){
        Report.updateOne({ $and: [{ 'author': volunteerObjectId }, { 'subject': userObjectId}] }, { $push: { 
          text: report
        }})
          .then(result => {
            res.redirect(`/volunteer/${vid}`);
          })
          .catch(err => {
            console.log('Error while pushing report to DB', err);
          });
      } else{
        newReport.save()
          .then(report => {
            //console.log('New Report saved:', report);

            const userId = report.subject;
            const reportId = report._id;
            const reportObjectId = mongoose.Types.ObjectId(reportId);
            
            // console.log('userObjectId', userId);
            // console.log('Report ID: ', report._id);
  
            User.updateOne({ _id: userId }, { $push: { 
              reports: reportObjectId,
            }})
              .then(result => {
                console.log('user reports updated! Result:', result);
                res.redirect(`/volunteer/${vid}`);
              })
              .catch(err => {
                console.log('Error while updating reports in user', err);
              });
          })
          .catch(err => {
            console.log('Error while saving report to DB', err);
          });
      }
    })
    .catch(err =>{
      console.log('Error while retrieving report from DB', err);
    });
});

/* DELETE volunteer account */
router.post('/volunteer/:id/delete', (req,res, next) => {
  const vid = req.params.id;
  console.log("testing delete account");

  try{
    req.session.destroy(() => {
      Volunteer.deleteOne({ _id: vid })
        .then(result => {
          console.log('Volunteer deleted: ', result);
          res.redirect('/');
        })
        .catch (err => {
          console.log('An error occurred while deleting volunteer from DB: ', err);
        });
    });
  } catch{
    console.log('error delete');
  }
});


/*POST update volunteer details*/
router.post('/volunteer/:id/:action', uploadCloud.single('photo'), [
  check('firstName', 'First name must be filled')
    .not().isEmpty(),
  check('lastName', 'Last name must be filled')
    .not().isEmpty(),
  check('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  check('address', 'Address must be filled')
    .not().isEmpty(),
  check('volPhoneNumber')
    .isMobilePhone('pt-PT').withMessage('Phone number must have 9 digits'),
  check('password', 'Minimum length of 6 characters')
    .isLength({ min: 6 })
], async (req,res, next) => {
  const vid = req.params.id;
  const action = req.params.action;

  const errorsResult = validationResult(req);
  const errors = errorsResult.errors;
  
  let volunteerObject;

  try {
    volunteerObject = await Volunteer.findById(vid)
    .populate('assignedUsers');
  } catch {
    console.log('error fetching volunteer');
  }

  //console.log('VOLUNTEER OBJECT:', volunteerObject);


  const {
    firstName,
    lastName,
    email,
    address,
    volPhoneNumber,
    occupation,
    aboutMe,
    //availability
    morning,
    afternoon,
    evening,
    night,
    overNight,
    fullDay,
    //skills
    healthCare,
    houseCare,
    displacements,
    grocery,
    pupil,
    password
  } = req.body;

  // ---- CHECKBOX VALUES 
  const availablePeriods = [];

  if (morning) {
    availablePeriods.push(morning);
  }
  if (afternoon) {
    availablePeriods.push(afternoon);
  }
  if (evening) {
    availablePeriods.push(evening);
  }
  if (night) {
    availablePeriods.push(night);
  }
  if (overNight) {
    availablePeriods.push(overNight);
  }
  if (fullDay) {
    availablePeriods.push(fullDay);
  }

  const skills = [];

  if (healthCare) {
    skills.push(healthCare);
  }
  if (houseCare) {
    skills.push(houseCare);
  }
  if (displacements) {
    skills.push(displacements);
  }
  if (grocery) {
    skills.push(grocery);
  }
  if (pupil) {
    skills.push(pupil);
  }


  if(action === 'updatePersonalDetails'){
    // console.log('ERRORS RESULT:',errorsResult);
    errorsResult.errors.pop();
    // console.log('errorsResult.error.pop(): (pops password)', errorsResult);

    if(!errorsResult.isEmpty()){
      res.render('volunteer-edit', {
        volunteer: volunteerObject,  
        errors: errors,
      });

    } else{
      Volunteer.updateOne({ _id: vid }, { $set: { 
        firstName,
        lastName,
        email,
        address,
        volPhoneNumber,
        occupation,
        aboutMe
      }})
        .then(volunteer => {
          console.log('Volunteer personal details updated!');
          res.redirect(`/volunteer/${vid}/edit`);
        })
        .catch(err => {
          console.log('Error while updating volunteer personal details in DB:', err);
        });
      }
  }

  if(action === 'updateAvailability'){
    Volunteer.updateOne({ _id: vid }, { $set: { 
      availablePeriods: availablePeriods
    }})
      .then(volunteer => {
        console.log('Volunteer available periods updated!');
        res.redirect(`/volunteer/${vid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating volunteer available periods in DB:', err);
      });
  }

  if(action === 'updateSkill'){
    Volunteer.updateOne({ _id: vid }, { $set: { 
      skills: skills
    }})
      .then(volunteer => {
        console.log('Volunteer specific needs updated!');
        res.redirect(`/volunteer/${vid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating volunteer skills in DB:', err);
      });
  }

  if(action === 'uploadPhoto'){
    const imgPath = req.file.url;
    const imgName = req.file.originalname;

    Volunteer.updateOne({ _id: vid }, { $set: { imgPath, imgName }})
      .then(volunteer => {
        console.log('Volunteer profile picture uploaded!');
        res.redirect(`/volunteer/${vid}/edit`);
      })
      .catch(err => {
        console.log('Error while updating volunteer profile picture in DB:', err);
      });
  }

  if(action === 'changePassword'){
    console.log('ERRORS RESULT:',errorsResult);
    errorsResult.errors.splice(0, 5);
    console.log('ERRORS RESULT:',errorsResult);

    if(!errorsResult.isEmpty()){
      res.render('volunteer-edit', {
        volunteer: volunteerObject,  
        errors: errors,
      });
    } else{
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        Volunteer.updateOne({ _id: vid }, { $set: { password: hashPass }})
          .then(volunteer => {
            //console.log('VOLUNTEER',vid)
            console.log('Volunteer password updated!');
            res.redirect(`/volunteer/${vid}/edit`);
          })
          .catch(err => {
            console.log('Error while updating volunteer password in DB:', err);
          });
    }
  }


});

module.exports = router;