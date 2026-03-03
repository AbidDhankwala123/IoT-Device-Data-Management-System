const express = require("express");
const router = express.Router();
const { registerDevice, getDeviceById, updateDeviceStatusById, listDevices } = require("../controllers/deviceController");

router.get("/devices/:deviceId", getDeviceById);
router.get("/devices", listDevices);
router.post("/devices", registerDevice);
router.patch("/devices/:deviceId/status", updateDeviceStatusById);

module.exports = router