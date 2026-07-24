const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    type: [String],   // যেমন: ["React", "Node.js", "MongoDB"]
    required: true
  },
  liveLink: {
    type: String
  },
  githubLink: {
    type: String
  },
  thumbnail: {
    type: String       // Cloudinary image URL এখানে যাবে (Bondhu-তে যেমন করেছিলে)
  },
  featured: {
    type: Boolean,
    default: false      // Home page-এ কোন প্রজেক্ট আগে দেখাবে সেটা control করার জন্য
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);