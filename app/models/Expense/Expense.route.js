const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Expenses = require('./Expense.model');
const Group = require('../Group/Group.model');
app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = bodyParser.json();

router.route('/').post(jsonParser, (req, res) => {
	Expenses.createExpense(req);
	res.json(Expenses.expenses);
});

router.route('/simplify').post(jsonParser, (req, res) => {
	Expenses.simplifyBalance(req);
	res.json(Group.groups);
});

module.exports = router;
