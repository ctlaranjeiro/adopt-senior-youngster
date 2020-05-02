/* jshint esversion: 9*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
  accountType: { type: String, default: 'Institution'},
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true },
  webpageUrl: { type: String },
  institutionType: { type: String, required: true, enum: ['Health Care', 'Parish', 'Public', 'Court', 'Social Support', 'Retirement Home'] },
  avatarUrl: {
    type: String,
    default: (nameInitial) => {
    nameInitial = this.name[0];
    return nameInitial;
    }
  },
  adress: { type: String, required: true },
  phoneNumber: { type: Number, required: true, minlength: 9, maxlength: 9 },
  socialMedia: { type: Array }
}, {
  timestamps: true
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;