/**
 * @requires profiles
 * @returns top profession with amount
 */
exports.getTopProfession = function (jobs) {
	const jobsTypes = _getJobTypeTotals(jobs);
	return _findTopProfession(jobsTypes);
};

/**
 * @param jobs
 * @returns top clients by their paid amount
 */
exports.getTopClients = function (jobs) {
	return jobs.map((job) => {
		const contract = job.Contract;
		const {firstName, lastName, id} = contract.Client;
		return {
			id,
			fullName: `${firstName} ${lastName}`,
			paid: job.price
		};
	});
}

/**
 * @param jobs
 * @returns returns a map of job types and their totals
 */
function _getJobTypeTotals(jobs) {
	const jobsTypes = new Map();

	if (!jobs || !jobs.length) {
		return jobsTypes;
	}

	jobs.forEach((job) => {
		const contract = job.Contract;
		const profile = contract.Contractor;

		if (!jobsTypes.has(profile.profession)) {
			jobsTypes.set(profile.profession, job.price)
			return
		}

		const current = jobsTypes.get(profile.profession)
		const newTotal = current + job.price;
		jobsTypes.set(profile.profession, newTotal)
	});

	return jobsTypes;
}

/**
 * @param jobsTypes
 * @returns returns topProfession and if there are ones that have matching totals will then return both
 */
function _findTopProfession(jobsTypes) {
	// NOTE: Made an array of professions in case there are multiple that have earned the same amount
	const topProfession = {
		professions: [], amount: 0
	}

	for (const [key, value] of jobsTypes.entries()) {
		if (value === topProfession.amount) {
			topProfession.professions.push(key);
		} else if (value > topProfession.amount) {
			topProfession.professions = [];
			topProfession.professions.push(key);
			topProfession.amount = value;
		}
	}

	return topProfession;
}
