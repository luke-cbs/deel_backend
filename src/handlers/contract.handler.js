const {Op} = require("sequelize");
const ContractStatuses = require("../enums/contract-statuses.enum");

/**
 * retrieves all non-terminated contracts and adds to locals
 * @param req - express request
 * @param res - express response
 * @param next - express next
 * @requires res.locals.profile
 */
exports.getNonTerminatedContracts = async function (req, res, next) {
	const {Contract, Job} = req.app.get('models')
	const {id: profileID} = res.locals.profile;
	const filter = {
		include: Job,
		where: {
			[Op.or]: [
				{ClientId: profileID},
				{ContractorId: profileID}
			],
			status: {
				[Op.not]: ContractStatuses.Terminated
			},
		}
	};

	const contracts = await Contract.findAll(filter);

	if (!contracts) return next(new Error(`failed to find contracts for - ${profileID}`))

	res.locals.data = contracts;
	next();
};

/**
 * retrieves a single non-terminated contract and adds to locals
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
exports.getNonTerminatedContract = async function (req, res, next) {
	const {Contract, Job} = req.app.get('models')
	const {id} = req.params
	const {id: profileID} = res.locals.profile;
	const filter = {
		include: Job,
		where: {
			id,
			[Op.or]: [
				{ClientId: profileID},
				{ContractorId: profileID}
			]
		}
	};

	const contract = await Contract.findOne(filter);

	if (!contract) {
		return next(new Error(`failed to find contract - ${id}`))
	}

	res.locals.data = contract;
	next();
}
