/**
 * adds profile to res.locals
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
const getProfile = async (req, res, next) => {
	const {Profile} = req.app.get('models')
	const profile = await Profile.findOne({where: {id: req.get('profile_id') || 0}})

	if (!profile) {
		return next(new Error(`could not find profile, please ensure header 'profile_id' is set`));
	}

	res.locals.profile = profile
	next();
}
module.exports = {getProfile}
