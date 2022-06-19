const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Expenses = require('./Expense.model');
const ExpenseController = require('./Expense.controller');
const Group = require('../Group/Group.model');
app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = bodyParser.json();

router
	.route('/')
	.post(jsonParser, (req, res) => {
		res.json(Expenses.setExpense(req));
	})
	.get(jsonParser, (req, res) => {
		res.json(Expenses.getExpenses(req.body.id));
	});

router.route('/simplify').post(jsonParser, (req, res) => {
	ExpenseController.simplifyBalance(req);
	res.json(Group.groups);
});

module.exports = router;
