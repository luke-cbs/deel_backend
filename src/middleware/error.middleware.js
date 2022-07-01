/**
 * sends the error message to client
 * @param err - express request
 * @param req - express request
 * @param res - express response
 */
module.exports = function errorHandler(err, req, res, next) {
	res.status(500).json({
		message: err.message,
	});
}
