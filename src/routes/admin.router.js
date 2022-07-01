const express = require("express");

const {handleResponse} = require("../middleware/response.middleware");
const {getBestProfession, getBestClients} = require("../handlers/admin.handler");

const router = express.Router()

/**
 * @returns Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/admin/best-profession', getBestProfession, handleResponse);

/**
 * @returns Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/admin/best-clients', getBestClients, handleResponse);

module.exports = router;
