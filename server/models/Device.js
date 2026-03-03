const mongoose = require("mongoose");
/*
1. Device Management
Implement APIs to:
      •     Register a device with deviceId (unique), type (temperature, humidity, motion, etc.), location (lat, long), status (active/inactive), and createdAt.
      •     Update device status (active/inactive).
      •     Get device details by deviceId.
      •     List all devices with pagination and filter by status or type.
*/
const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["temperature", "humidity", "motion"],
        required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
deviceSchema.index({ "location.lat": 1, "location.long": 1 });
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device