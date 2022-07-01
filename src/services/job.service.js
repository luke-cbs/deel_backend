const {sequelize} = require("../model");

/**
 * @param job
 * @returns returns a promise which will update the job paid, client and contractor balances
 */
exports.payClientAndContractor = async function (job) {
	let transaction = null;
	const date = new Date().toISOString();
	const {Client: client, Contractor: contractor} = job.Contract;
	const balances = _distributeJobCost(client.balance, contractor.balance, job.price);

	try {
		transaction = await sequelize.transaction();
		await job.update({
			paid: true,
			paymentDate: date,
		}, {transaction});
		await job.Contract.Client.update({balance: balances.client}, {transaction})
		await job.Contract.Contractor.update({balance: balances.contractor}, {transaction})
		await transaction.commit();
		await job.reload();
		return job;
	} catch (e) {
		if (transaction) {
			await transaction.rollback();
		}

		throw e;
	}
}

/**
 * @param clientBalance
 * @param contractorBalance
 * @param jobCost
 * @returns new balances for client and contractor
 */
function _distributeJobCost(clientBalance, contractorBalance, jobCost) {
	return {
		client: parseFloat((clientBalance - jobCost).toFixed(2)),
		contractor: parseFloat((contractorBalance + jobCost).toFixed(2))
	};
}


