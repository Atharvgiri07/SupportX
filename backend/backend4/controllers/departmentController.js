const Department = require('../models/Department');
const User = require('../models/User');

// @desc   Create department
// @route  POST /api/departments
// @access Private/Admin
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Department name is required' });

    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Department already exists' });

    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all departments, each with its current employees
// @route  GET /api/departments
// @access Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().lean();

    // We intentionally don't rely on Department.employees for this — a
    // separately-maintained array can drift out of sync. User.department
    // is the single source of truth, so we look employees up from there.
    const withEmployees = await Promise.all(
      departments.map(async (dept) => {
        const employees = await User.find({ department: dept._id, role: 'employee' }).select(
          'name email performanceScore currentOpen'
        );
        return { ...dept, employees };
      })
    );

    res.json(withEmployees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update department
// @route  PUT /api/departments/:id
// @access Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    department.name = req.body.name || department.name;
    department.description = req.body.description ?? department.description;
    await department.save();
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete department
// @route  DELETE /api/departments/:id
// @access Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await department.deleteOne();
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };
