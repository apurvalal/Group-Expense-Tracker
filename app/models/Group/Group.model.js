const crypto = require('crypto');

const groups = [];
function setGroup(members) {
	const groupID = 1;
	const group = {};
	group['id'] = groupID;
	group['members'] = {};
	members.forEach(member => {
		const memberID = crypto.randomBytes(8).toString('hex');
		group['members'][member] = { id: memberID, netBalance: 0 };
	});
	groups.push(group);

	return groups;
}

module.exports = {
	groups,
	setGroup,
};
