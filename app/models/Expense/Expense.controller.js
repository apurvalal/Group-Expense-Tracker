const crypto = require('crypto');
const Group = require('../Group/Group.model');

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

function findMaximum(balances) {
	let maximumBalance = balances[0].value;
	let maximumBalanceIndex = 0;
	for (let balance in balances) {
		if (balances[balance].value > maximumBalance) {
			maximumBalance = balances[balance].value;
			maximumBalanceIndex = balance;
		}
	}
	return maximumBalanceIndex;
}

function findMinimum(balances) {
	let minimumBalance = balances[0].value;
	let minimumBalanceIndex = 0;
	for (let balance in balances) {
		if (balances[balance].value < minimumBalance) {
			minimumBalance = balances[balance].value;
			minimumBalanceIndex = balance;
		}
	}
	return minimumBalanceIndex;
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

	const maximumBalanceIndex = findMaximum(currentBalances);
	const minimumBalanceIndex = findMinimum(currentBalances);

	if (
		currentBalances[maximumBalanceIndex].value >
		-1 * currentBalances[minimumBalanceIndex].value
	) {
	}

	let temp = currentBalances[maximumBalanceIndex].value;
	currentBalances[maximumBalanceIndex].value +=
		currentBalances[minimumBalanceIndex].value;
}

module.exports = {
	selectGroupByID,
	simplifyBalance,
	addPayment,
	addUnregisteredMembers,
	getMembers,
};
