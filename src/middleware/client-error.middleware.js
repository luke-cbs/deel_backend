/**
 * sends a response when client request fails
 * @param err - express request
 * @param req - express request
 * @param res - express response
 * @param next - express response
 */
module.exports = function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({error: 'Something went wrong!'});
	} else {
		next(err);
	}
};
