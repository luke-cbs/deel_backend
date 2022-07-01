const express = require("express");
const {Op} = require("sequelize");

const {getProfile} = require("../middleware/getProfile");
const {depositIntoToClientAccount} = require("../handlers/balance.handler");
const {handleResponse} = require("../middleware/response.middleware");

const router = express.Router()

/**
 * @returns Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
router.post('/balances/deposit/:userId', getProfile, depositIntoToClientAccount, handleResponse);

module.exports = router;
