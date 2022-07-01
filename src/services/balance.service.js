const {sequelize} = require("../model");

/**
 * @param profile
 * @param amount
 * @returns returns a promise, that updates a client balance
 */
exports.depositToClient = async function (profile, amount) {
	let transaction = null;
	const contracts = profile.Client;
	const canDeposit = _userCanDeposit(contracts, amount);

	if (!canDeposit) {
		throw Error('deposit amount too large for amount of jobs.');
	}

	const newBalance = profile.balance + amount;

	try {
		transaction = await sequelize.transaction();
		await profile.update({balance: newBalance}, {transaction})
		await transaction.commit();
	} catch (e) {
		if (transaction) {
			await transaction.rollback();
		}

		throw e;
	}

	await profile.reload();
	return profile;
}

/**
 * @param contracts
 * @param amount
 * @returns returns booleans if combined jobs amount less than deposit amount
 */
function _userCanDeposit(contracts, amount) {
	if (!contracts || !contracts.length) {
		return false;
	}

	const depositAnchor = 0.25;

	const jobTotal = contracts.reduce((acc, item) => {
		if (item.Jobs && item.Jobs.length) {
			item.Jobs.forEach((job) => {
				if (!job.paid) acc += job.price;
			});
		}
		return acc;
	}, 0);

	// Question: the API spec was not overly clear on this edge case but,
	// I understood it as they can only deposit 25% of the sum of all their unpaid jobs
	// meaning that if this hit 0 they would not be able to deposit anything?
	const allowedDepositTotal = parseFloat((jobTotal * depositAnchor).toFixed(2));

	return amount <= allowedDepositTotal;
}
