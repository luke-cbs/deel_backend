const {Op} = require("sequelize");
const ProfileTypes = require("../enums/profile-types.enum");
const adminService = require("../services/admin.service");
const ContractStatuses = require("../enums/contract-statuses.enum");

/**
 * find top profession between two dates
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
exports.getBestProfession = async function (req, res, next) {
	const {Job, Contract, Profile} = req.app.get('models')
	const {start, end} = req.query;

	if (!isValidDateRange(start, end)) {
		return next(new Error(`invalid date range`));
	}

	const filter = {
		where: {
			paid: true,
			paymentDate: {
				[Op.between]: [start, end]
			},
		},
		include: {
			model: Contract,
			include: {
				model: Profile,
				as: ProfileTypes.Contractor
			}
		}
	}

	const jobs = await Job.findAll(filter);

	if (!jobs) {
		return next(new Error(`failed to find user profiles.`));
	}

	res.locals.data = adminService.getTopProfession(jobs);
	next();
}

/**
 * get top paying clients between two dates
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
exports.getBestClients = async function (req, res, next) {
	const {Job, Contract, Profile} = req.app.get('models')
	const {start, end, limit} = req.query;

	if (!isValidDateRange(start, end)) {
		return next(new Error(`invalid date range`));
	}

	const filter = {
		where: {
			paid: true,
			paymentDate: {
				[Op.between]: [start, end]
			},
		},
		order: [
			['price', 'DESC'],
		],
		limit: limit ? limit : 2,
		include: {
			model: Contract,
			where: {
				status: ContractStatuses.InProgress,
			},
			include: {
				model: Profile,
				as: ProfileTypes.Client
			}
		}
	};

	const jobs = await Job.findAll(filter);

	if (!jobs) {
		return next(new Error(`failed to find jobs.`));
	}

	res.locals.data = adminService.getTopClients(jobs);

	next();
}

function isValidDateRange(start, end) {
	return new Date(start).getTime() <= new Date(end).getTime();
}
