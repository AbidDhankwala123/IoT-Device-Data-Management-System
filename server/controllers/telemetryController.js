const AppError = require("../utils/AppError");
const Telemetry = require("../models/Telemetry");
const Device = require("../models/Device");


const insertTelemetry = async (req, res, next) => {
    try {
        const { deviceId, timestamp, metrics } = req.body;

        if (!deviceId) {
            return next(new AppError("DeviceId is required", 400));
        }

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return next(new AppError("Device not found", 404));
        }

        if (!timestamp || isNaN(new Date(timestamp))) {
            return next(new AppError("Valid timestamp is required", 400));
        }

        if (!metrics || typeof metrics !== "object") {
            return next(new AppError("Metrics must be an object", 400));
        }

        if (metrics.temperature === undefined && metrics.humidity === undefined && metrics.battery === undefined) {
            return next(new AppError("At least one metric is required", 400));
        }

        if (metrics.temperature !== undefined && typeof metrics.temperature !== "number") {
            return next(new AppError("Temperature must be a number", 400));
        }

        if (metrics.humidity !== undefined && typeof metrics.humidity !== "number") {
            return next(new AppError("Humidity must be a number", 400));
        }

        if (metrics.battery !== undefined && typeof metrics.battery !== "number") {
            return next(new AppError("Battery must be a number", 400));
        }

        const telemetry = await Telemetry.create({ deviceId, timestamp, metrics });

        res.status(201).json({
            status: "SUCCESS",
            message: "Telemetry inserted successfully",
            telemetry
        });
    } catch (error) {
        next(error);
    }
}

const bulkInsertTelemetry = async (req, res, next) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return next(new AppError("Data must be a non empty array", 400));
        }

        for (let item of data) {
            const { deviceId, timestamp, metrics } = item;
            if (!deviceId) {
                return next(new AppError("DeviceId is required", 400));
            }

            const device = await Device.findOne({ deviceId });
            if (!device) {
                return next(new AppError("Device not found", 404));
            }

            if (!timestamp || isNaN(new Date(timestamp))) {
                return next(new AppError("Valid timestamp is required", 400));
            }

            if (!metrics || typeof metrics !== "object") {
                return next(new AppError("Metrics must be an object", 400));
            }

            if (metrics.temperature === undefined && metrics.humidity === undefined && metrics.battery === undefined) {
                return next(new AppError("At least one metric is required", 400));
            }

            if (metrics.temperature !== undefined && typeof metrics.temperature !== "number") {
                return next(new AppError("Temperature must be a number", 400));
            }

            if (metrics.humidity !== undefined && typeof metrics.humidity !== "number") {
                return next(new AppError("Humidity must be a number", 400));
            }

            if (metrics.battery !== undefined && typeof metrics.battery !== "number") {
                return next(new AppError("Battery must be a number", 400));
            }

        }

        const telemetries = await Telemetry.insertMany(data);

        res.status(201).json({
            status: "SUCCESS",
            message: "Bulk Telemetries inserted successfully",
            telemetries
        });

    } catch (error) {
        next(error);
    }
}



module.exports = { insertTelemetry, bulkInsertTelemetry }
