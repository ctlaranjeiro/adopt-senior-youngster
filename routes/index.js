/* jshint esversion: 9*/
const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const Volunteer = require('../models/volunteer');

const uploadCloud = require('../config/cloudinary');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
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
// TO IMPLEMENT CLOUDINARY

// router.get(/* adicionar user */, (req, res) => {
//   res.render(/* */);
// });

// router.post(/* */, uploadCloud.single('photo'), (req, res) => {
//   const { title, description } = req.body;
//   const imgPath = req.file.url;
//   const imgName = req.file.originalname;
//   const newUser = new User({user, name});
//   newUser.save()
//     .then(user => {
//       res.redirect('/');
//     })
// })

module.exports = router;
