/**
 * @param req - express request
 * @param res - express response
 * @param next - express next
 * @returns res.json based on local data to respond
 */
exports.handleResponse = function (req, res, next) {
	if (!res?.locals?.data) {
		return next(new Error(`failed to send response, no response data given`));
	}

	return res.json(res.locals.data);
}
