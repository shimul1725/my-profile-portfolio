const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Experience', 'Education']   // কোনটা চাকরি, কোনটা পড়াশোনা
  },
  title: {
    type: String,
    required: true      // যেমন: "Backend Developer Intern" অথবা "B.Sc in Computer Science"
  },
  organization: {
    type: String,
    required: true      // যেমন: কোম্পানির নাম বা বিশ্ববিদ্যালয়ের নাম
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date          // এখনো চলছে হলে খালি রাখা যাবে
  },
  currentlyActive: {
    type: Boolean,
    default: false      // "Present" দেখানোর জন্য
  },
  description: {
  type: [String],   // এখন bullet point-এর array হিসেবে save হবে
  default: []
}
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);