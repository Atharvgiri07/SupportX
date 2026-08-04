const Category = require('../models/Category');
const Ticket = require('../models/Ticket');

const DEFAULT_CATEGORIES = [
  { name: 'Engineering', description: 'Software, code bugs, and technical issues', color: '#3b82f6', icon: '🛠️' },
  { name: 'Sales', description: 'Sales queries, leads, and quotes', color: '#10b981', icon: '💰' },
  { name: 'Billing', description: 'Invoices, payments, and subscriptions', color: '#8b5cf6', icon: '💳' },
  { name: 'HR', description: 'Human resources and employee requests', color: '#ec4899', icon: '👥' },
  { name: 'IT Support', description: 'Hardware, network, and access support', color: '#f59e0b', icon: '💻' },
  { name: 'Security', description: 'Security incidents and access permissions', color: '#ef4444', icon: '🔒' },
  { name: 'Product', description: 'Feature requests and product feedback', color: '#06b6d4', icon: '📦' },
  { name: 'General', description: 'Other general support inquiries', color: '#64748b', icon: '❓' },
];

const seedDefaultCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
  }
};

// @desc Get all categories
// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    await seedDefaultCategories();
    const categories = await Category.find().sort({ name: 1 });

    // Compute ticket count for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (cat) => {
        const ticketCount = await Ticket.countDocuments({ category: cat.name });
        return {
          ...cat.toObject(),
          ticketCount,
        };
      })
    );

    res.json(categoriesWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// @desc Create a new category
// @route POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      color: color || '#3b82f6',
      icon: icon || '🏷️',
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// @desc Update category
// @route PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { name, description, color, icon, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
