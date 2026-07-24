const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');

router.get('/', getAllExperiences);
router.post('/', verifyToken, createExperience);
router.put('/:id', verifyToken, updateExperience);
router.delete('/:id', verifyToken, deleteExperience);

module.exports = router;