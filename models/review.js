/* jshint esversion: 9*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    // rate: [{type: Number, min: 1, max: 5, required: true }],
    review: [{ type: Object, required: true, maxlength: 1500 }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // referente ao volunteer
    subject: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true } // referent ao user
  }, {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;