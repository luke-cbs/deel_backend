/**
 * logs errors to console with stack
 * @param err - express request
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
module.exports = function logErrors(err, req, res, next) {
	console.error(err.stack)
	next(err)
};
