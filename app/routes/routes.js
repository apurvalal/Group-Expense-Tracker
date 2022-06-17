const express = require('express');
const groupRoutes = require('../models/Group/Group.route');
const expenseRoutes = require('../models/Expense/Expense.route');
const router = express.Router();

router.use('/group', groupRoutes);
router.use('/expense', expenseRoutes);
module.exports = router;
