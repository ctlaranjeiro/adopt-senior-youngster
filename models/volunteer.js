/* jshint esversion: 9*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
  accountType: { type: String, default: 'Volunteer'},
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  avatarUrl: {
    type: String,
    default: (firstNameInitial, lastNameInitial) => {
    firstNameInitial = this.firstName[0];
    lastNameInitial = this.lastName[0];
    return firstNameInitial, lastNameInitial;
    }
  },
  birthDate: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true, minlength: 9, maxlength: 9 },
  occupation: { type: String },
  skills: { type: String, required: true, enum: ['Health Care', 'House Care/Maintnense', 'Dislocations', 'Grocery Shopping', 'Mentor (for at-risk youth in need of a mentor)'] },
  availablePeriods: { type: String, required: true, enum: ['Morning: 8am - 12pm', 'Afternoon: 12pm - 4pm', 'Evening: 4pm - 8pm', 'Night: 8pm - 12am', 'Over Night: 12am - 8am', '24 hours'] },
  isHelping: { type: Boolean, default: false },
  aboutMe: { type: String, maxlength: 250 },
  evaluation: {
    averageRate: { type: Number, min:1, max: 5},
    reviews: { type: Schema.Types.ObjectId, ref: 'Review' } // Interligar com review.js
  }
}, {
  timestamps: true
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;