const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.post('/', protect, requireAdmin, createDepartment);
router.get('/', protect, getDepartments);
router.put('/:id', protect, requireAdmin, updateDepartment);
router.delete('/:id', protect, requireAdmin, deleteDepartment);

module.exports = router;
