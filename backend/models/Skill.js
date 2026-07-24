const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true       // যেমন: "React", "Node.js", "MongoDB"
  },
  category: {
    type: String,
    required: true,      // যেমন: "Frontend", "Backend", "Database", "Tools"
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Other']
  },
  proficiency: {
    type: Number,        // ০ থেকে ১০০ এর মধ্যে (progress bar দেখানোর জন্য)
    min: 0,
    max: 100,
    default: 70
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);