const express = require("express");

const {getProfile} = require("../middleware/getProfile");
const {getNonTerminatedContracts, getNonTerminatedContract} = require("../handlers/contract.handler");
const {handleResponse} = require("../middleware/response.middleware");

const router = express.Router()

/**
 * @returns contract by id as well as user profile.id (ClientId or ContractorId)
 */
router.get('/contracts', getProfile, getNonTerminatedContracts, handleResponse);

/**
 * @returns contract based on id and user profile.id (ClientId or ContractorId)
 */
router.get('/contracts/:id', getProfile, getNonTerminatedContract, handleResponse);

module.exports = router;
