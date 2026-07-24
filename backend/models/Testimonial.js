const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true    // যেমন: "Senior Developer at XYZ", "CS Professor", "Project Client"
  },
  message: {
    type: String,
    required: true
  },
  avatar: {
    type: String       // Optional, Cloudinary URL
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);