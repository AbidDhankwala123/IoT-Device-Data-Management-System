const AppError = require("../utils/AppError");
const Telemetry = require("../models/Telemetry");
const Device = require("../models/Device");

/*
Telemetry insert data
{
    "deviceId":"dev-104",
    "timestamp":"2026-04-01T10:30:00Z",
    "metrics":{
    "temperature": 23.5,
    "humidity": 40,
    "battery": 15
    }
}
*/
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

/*
Bulk telemetry insert data
{
    "data":[
       {
        "deviceId":"dev-102",
         "timestamp":"2026-03-01T10:30:00Z",
         "metrics":{
         "temperature": 35.0,
         "humidity": 65,
         "battery": 70
         }   
       },
       {
        "deviceId":"dev-104",
         "timestamp":"2026-02-15T10:30:00Z",
         "metrics":{
         "temperature": 23.8,
         "humidity": 75,
         "battery": 87
         }   
       },
       {
        "deviceId":"dev-101",
         "timestamp":"2026-03-15T10:30:00Z",
         "metrics":{
         "temperature": 38.4,
         "humidity": 68,
         "battery": 78
         }   
       }
   ]
}
*/
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

const getTelemetryByRange = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const { start, end } = req.query;

        const device = await Device.findOne({ deviceId });

        if (!device) {
            return next(new AppError("Device not found", 400));
        }

        if (!start || !end) {
            return next(new AppError("Start and End date are required", 400));
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
            return next(new AppError("Start and end Dates must be valid dates", 400))
        }

        if (startDate > endDate) {
            return next(new AppError("Start date cannot be after End date", 400))
        }

        const telemetry = await Telemetry.find({ deviceId, timestamp: { $gte: startDate, $lte: endDate } });

        res.status(200).json({
            status: "SUCCESS",
            telemetry
        })
    } catch (error) {
        next(error);
    }
}

const getLatestTelemetry = async (req, res, next) => {
    try {
        const telemetry = await Telemetry.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$deviceId", latestTelemetry: { $first: "$$ROOT" } } }
        ]);

        res.status(200).json({
            status: "SUCCESS",
            telemetry
        })
    } catch (error) {
        next(error);
    }
}

const getStats = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const { start, end, metric } = req.query;

        const device = await Device.findOne({ deviceId });

        if (!device) {
            return next(new AppError("Device not found", 400));
        }

        if (!start || !end) {
            return next(new AppError("Start and End date are required", 400));
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
            return next(new AppError("Start and end Dates must be valid dates", 400))
        }

        if (startDate > endDate) {
            return next(new AppError("Start date cannot be after End date", 400))
        }

        if (!metric || !["temperature", "humidity", "battery"].includes(metric)) {
            return next(new AppError("Metric must be temperature, humidity, or battery", 400));
        }

        const telemetryStats = await Telemetry.aggregate([
            { $match: { deviceId, timestamp: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,
                    avg: { $avg: `$metrics.${metric}` },
                    min: { $min: `$metrics.${metric}` },
                    max: { $max: `$metrics.${metric}` }
                }
            }
        ])

        res.status(200).json({
            status: "SUCCESS",
            telemetryStats
        })
    } catch (error) {
        next(error);
    }
}

const lowBattery = async (req, res, next) => {
    try {
        const threshold = Number(req.query.threshold) || 20;
        if (isNaN(threshold) || threshold < 0 || threshold > 100) {
            return next(new AppError("Threshold must be a number between 0 and 100", 400));
        }

        const telemetryData = await Telemetry.find({ "metrics.battery": { $lt: threshold } });
        res.status(200).json({
            status: "SUCCESS",
            telemetryData
        })
    } catch (error) {
        next(error);
    }
}

const offlineDevices = async (req, res, next) => {
    try {
        const minutes = Number(req.query.minutes) || 15;
        if (isNaN(minutes) || minutes <= 0) {
            return next(new AppError("Minutes must be a positive number", 400));
        }

        const thresholdTime = new Date(Date.now() - minutes * 60 * 1000);

        const latestTelemetry = await Telemetry.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$deviceId", lastSeen: { $first: "$timestamp" } } },
            { $match: { lastSeen: { $lt: thresholdTime } } }
        ]);

        res.status(200).json({
            status: "SUCCESS",
            latestTelemetry
        })
    } catch (error) {
        next(error);
    }
}
module.exports = { insertTelemetry, bulkInsertTelemetry, getTelemetryByRange, getLatestTelemetry, getStats, lowBattery, offlineDevices }
