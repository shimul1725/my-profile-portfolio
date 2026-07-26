const Experience = require('../models/Experience');

const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const experienceData = { ...req.body };

    if (typeof experienceData.description === 'string') {
      experienceData.description = experienceData.description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }

    const newExperience = new Experience(experienceData);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experienceData = { ...req.body };

    if (typeof experienceData.description === 'string') {
      experienceData.description = experienceData.description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      experienceData,
      { new: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience
};