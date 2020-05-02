/* jshint esversion: 9*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  accountType: { type: String, default: 'User'},
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  avatarUrl: {
    type: String,
    default: (firstNameInitial, lastNameIniial) => {
    firstNameInitial = this.firstName[0];
    lastNameIniial = this.lastName[0];
    return firstNameInitial, lastNameIniial;
    }
  },
  birthDate: { type: Date, required: true },
  adress: { type: String, required: true },
  phoneNumber: { type: Number, required: true, minlength: 9, maxlength: 9 },
  emergencyContact: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true, minlength: 9, maxlength: 9 },
    email: { type: String, required: true },
    adress: { type: String, required: true }
  },
  schudlePreference: { type: String, required: true, enum: ['Morning: 8am - 12pm', 'Afternoon: 12pm - 4pm', 'Evening: 4pm - 8pm', 'Night: 8pm - 12am', 'Over Night: 12am - 8am', '24 hours'] },
  specificNeeds: { type: String, required: true, enum: ['Health Care', 'House Care/Maintnense', 'Dislocations', 'Grocery Shopping', 'Pupil (for at-risk youth in need of a mentor)'] },
  hasHelp: { type: Boolean, default: false },
  reports: { type: Schema.Types.ObjectId, ref: 'Report' } // Interligar com report.js
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;