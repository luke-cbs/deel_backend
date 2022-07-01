const express = require("express");

const {getProfile} = require("../middleware/getProfile");
const {getUnpaid, payForJob} = require("../handlers/job.handler");
const {handleResponse} = require("../middleware/response.middleware");

const router = express.Router()

/**
 * @returns all unpaid jobs for a user (either a client or contractor), for active contracts only.
 */
router.get('/jobs/unpaid', getProfile, getUnpaid, handleResponse);

/**
 * @returns updated job that has been paid, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 */
router.post('/jobs/:job_id/pay', getProfile, payForJob, handleResponse);

module.exports = router;
