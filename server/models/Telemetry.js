const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    metrics: {
        temperature: Number,
        humidity: Number,
        battery: Number
    }
})

telemetrySchema.index({ timestamp: 1, expireAfterSeconds: 60 * 60 * 24 * 90 })

const Telemetry = mongoose.model("Telemetry", telemetrySchema);
module.exports = Telemetry