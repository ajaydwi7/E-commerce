const express = require("express");
const router = express.Router();
const { submitFreeTrial } = require("../Controller/freeTrialController");

// POST Route to submit the free trial form
router.post("/free-trial", submitFreeTrial);

module.exports = router;
