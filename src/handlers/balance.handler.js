const ProfileTypes = require("../enums/profile-types.enum");
const ContractStatuses = require("../enums/contract-statuses.enum");
const balanceService = require("../services/balance.service");

/**
 * deposit a maximum of 25% of the sum of total jobs unpaid at that point in time.
 * @param req - express request
 * @param res - express response
 * @param next - express next
 * @requires res.locals.profile
 * @requires req.params.userId
 */
exports.depositIntoToClientAccount = async function (req, res, next) {
	const {Job, Contract, Profile} = req.app.get('models')
	const {amount} = req.body;
	const {id} = res.locals.profile;
	const userId = parseInt(req.params.userId, 10);
	const filter = {
		where: {
			id
		},
		include: {
			model: Contract,
			as: ProfileTypes.Client,
			where: {
				status: ContractStatuses.InProgress,
				ClientId: id,
			},
			include: {
				required: false,
				model: Job,
				where: {
					paid: null
				},
			}
		},
	};

	if (userId !== id) {
		return next(new Error('You do not have permission to update this profile'));
	}

	const profile = await Profile.findOne(filter);

	if (!profile) {
		return next(new Error(`failed to find profile - ${userId}`));
	}

	res.locals.data = await balanceService.depositToClient(profile, amount)
		.catch((err) => next(err));

	next();
}
