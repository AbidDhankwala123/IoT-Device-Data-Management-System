const express = require("express");
const router = express.Router();
const { insertTelemetry, bulkInsertTelemetry } = require("../controllers/telemetryController");

router.post("/telemetry", insertTelemetry);
router.post("/telemetry/bulk", bulkInsertTelemetry);

module.exports = router