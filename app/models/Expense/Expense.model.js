const Group = require('../Group/Group.model');
const crypto = require('crypto');
const expenses = [];

function getMembers(req) {
	const paidByMembers = Object.keys(req.body.items[0].paid_by[0]);
	const owedByMembers = Object.keys(req.body.items[0].owed_by[0]);
	const allMembers = paidByMembers.concat(owedByMembers);
	let uniqueMembers = allMembers.filter((member, index) => {
		return allMembers.indexOf(member) === index;
	});

	return uniqueMembers;
}

function addUnregisteredMembers(
	allMembers,
	membersInGroup,
	selectedGroupIndex
) {
	for (member in allMembers) {
		if (membersInGroup.indexOf(allMembers[member]) == -1) {
			const memberID = crypto.randomBytes(8).toString('hex');
			Group.groups[selectedGroupIndex].members[allMembers[member]] = {
				id: memberID,
				netBalance: 0,
			};
		}
	}

	return;
}

function addPayment(req, selectedGroupIndex) {
	const paidByMembers = Object.keys(req.body.items[0].paid_by[0]);
	const owedByMembers = Object.keys(req.body.items[0].owed_by[0]);

	for (member in paidByMembers) {
		Group.groups[selectedGroupIndex].members[
			paidByMembers[member]
		].netBalance += req.body.items[0].paid_by[0][paidByMembers[member]];
	}

	for (member in owedByMembers) {
		Group.groups[selectedGroupIndex].members[
			owedByMembers[member]
		].netBalance -= req.body.items[0].owed_by[0][owedByMembers[member]];
	}

	return;
}

function selectGroupByID(req) {
	let selectedGroupIndex = 0;

	let numberOfGroups = Group.groups.length;
	for (let i = 0; i < numberOfGroups; i++) {
		if (Group.groups[i].id == req.body.id) {
			selectedGroupIndex = i;
		}
	}
	return selectedGroupIndex;
}

function createExpense(req) {
	const expenseID = crypto.randomBytes(8).toString('hex');
	const expense = {};
	expense['group_id'] = req.body.id;
	expense['name'] = req.body.name;
	expense['items'] = req.body.items;
	expense['createdAt'] = Date.now();
	expense['expense_id'] = expenseID;

	expenses.push(expense);

	const selectedGroupIndex = selectGroupByID(req);
	const membersInGroup = Object.keys(Group.groups[selectedGroupIndex].members);
	const allMembers = getMembers(req);

	addUnregisteredMembers(allMembers, membersInGroup, selectedGroupIndex);
	addPayment(req, selectedGroupIndex);
}

function simplifyBalance(req) {
	const selectedGroupIndex = selectGroupByID(req);
	let currentBalances = [];
	let index = 0;
	for (member in Group.groups[selectedGroupIndex].members) {
		const balance = {};
		balance['user'] = Object.keys(Group.groups[selectedGroupIndex].members)[
			index
		];
		balance['value'] =
			Group.groups[selectedGroupIndex].members[member].netBalance;
		index += 1;

		currentBalances.push(balance);
	}

	currentBalances = currentBalances.sort(function (a, b) {
		return a.value < b.value;
	});

	console.log(currentBalances);
}

module.exports = {
	expenses,
	createExpense,
	simplifyBalance,
};
