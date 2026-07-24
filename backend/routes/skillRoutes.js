const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

router.get('/', getAllSkills);
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

module.exports = router;