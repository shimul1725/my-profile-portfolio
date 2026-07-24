const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ---------- Routes ----------
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

const skillRoutes = require('./routes/skillRoutes');
app.use('/api/skills', skillRoutes);

const experienceRoutes = require('./routes/experienceRoutes');
app.use('/api/experience', experienceRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const testimonialRoutes = require('./routes/testimonialRoutes');
app.use('/api/testimonials', testimonialRoutes);

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});