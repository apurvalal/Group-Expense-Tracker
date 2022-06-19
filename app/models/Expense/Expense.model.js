const Group = require('../Group/Group.model');
const crypto = require('crypto');
const expenses = [];
const ExpenseController = require('./Expense.controller');

function setExpense(req) {
	const expenseID = crypto.randomBytes(8).toString('hex');
	const expense = {};
	expense['group_id'] = req.body.id;
	expense['name'] = req.body.name;
	expense['items'] = req.body.items;
	expense['createdAt'] = Date.now();
	expense['expense_id'] = expenseID;

	expenses.push(expense);

	const selectedGroupIndex = ExpenseController.selectGroupByID(req);
	const membersInGroup = Object.keys(Group.groups[selectedGroupIndex].members);
	const allMembers = ExpenseController.getMembers(req);

	ExpenseController.addUnregisteredMembers(
		allMembers,
		membersInGroup,
		selectedGroupIndex
	);
	ExpenseController.addPayment(req, selectedGroupIndex);

	return expenses;
}

function getExpenses(id) {
	for (let expense in expenses) {
		if (expense.expense_id == id) {
			return expense;
		}
	}
}

module.exports = {
	expenses,
	setExpense,
	getExpenses,
};
