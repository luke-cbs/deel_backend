const ContractStatuses = require("../enums/contract-statuses.enum");
const {Op} = require("sequelize");
const ProfileTypes = require("../enums/profile-types.enum");
const jobService = require("../services/job.service");

/**
 * retrieves all unpaid jobs for a user
 * @param req - express request
 * @param res - express response
 * @param next - express next
 * @requires res.locals.profile
 */
exports.getUnpaid = async function (req, res, next) {
	const {Job, Contract} = req.app.get('models')
	const {id: profileID} = res.locals.profile;
	const filter = {
		where: {
			paid: null
		},
		include: {
			model: Contract,
			attributes: [],
			where: {
				status: ContractStatuses.InProgress,
				[Op.or]: [
					{ClientId: profileID},
					{ContractorId: profileID}
				],
			}
		}
	}

	const jobs = await Job.findAll(filter);

	if (!jobs) return next(new Error(`failed to find jobs for user - ${profileID}`))

	res.locals.data = jobs;
	next();
}

/**
 * pay for a specified job if balances allows
 * @param req - express request
 * @param res - express response
 * @param next - express next
 * @requires res.locals.profile
 */
exports.payForJob = async function (req, res, next) {
	const {Job, Contract, Profile} = req.app.get('models')
	const {job_id: id} = req.params;
	const {id: profileID} = res.locals.profile;

	const filter = {
		where: {
			id,
			paid: null
		},
		include: {
			model: Contract,
			where: {
				status: ContractStatuses.InProgress,
				ClientId: profileID,
			},
			include: [{
				model: Profile,
				as: ProfileTypes.Contractor
			}, {
				model: Profile,
				as: ProfileTypes.Client
			}]
		},
	}

	const job = await Job.findOne(filter);

	if (!job) {
		return res.status(500).json({
			message: `this job(${id}) has been paid or does not exist.`
		});
	}

	const {Client: client} = job.Contract;

	if (client.balance < job.price) {
		return next(new Error(`not enough balance - your balance: ${client.balance} is too low for job ${job.price}`))
	}

	res.locals.data = await jobService.payClientAndContractor(job)
		.catch((err) => next(err));

	next();
}
