const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', protect, admin, createDepartment);
router.get('/', protect, getDepartments);
router.put('/:id', protect, admin, updateDepartment);
router.delete('/:id', protect, admin, deleteDepartment);

module.exports = router;
