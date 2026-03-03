const express = require("express");
const router = express.Router();
const { insertTelemetry, bulkInsertTelemetry, getTelemetryByRange, getLatestTelemetry, getStats, lowBattery, offlineDevices } = require("../controllers/telemetryController");

router.get("/telemetry/latest", getLatestTelemetry);
router.get("/telemetry/:deviceId", getTelemetryByRange);
router.get("/telemetry/:deviceId/stats", getStats);
router.get("/alerts/low-battery", lowBattery);
router.get("/alerts/offline-devices", offlineDevices)
router.post("/telemetry", insertTelemetry);
router.post("/telemetry/bulk", bulkInsertTelemetry);

module.exports = router