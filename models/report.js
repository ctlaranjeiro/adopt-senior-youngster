/* jshint esversion: 9*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'Volunteer' }, // referente ao volunteer
    subject: { type: Schema.Types.ObjectId, ref: 'User' }, // referent ao user
    text: [{ type: Object, required: true, maxlength: 1500 }]
  }, {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;