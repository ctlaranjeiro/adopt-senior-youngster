const express = require('express');
const router  = express.Router();

const uploadCloud = require('../config/cloudinary');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get(/* adicionar user */, (req, res) => {
  res.render(/* */);
});

router.post(/* */, uploadCloud.single('photo'), (req, res) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newUser = new User({user, name});
  newUser.save()
    .then(user => {
      res.redirect('/');
    })
})

module.exports = router;
