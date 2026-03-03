const Device = require("../models/Device");
const AppError = require("../utils/AppError");

/*
Device register data
{
    "deviceId":"dev-104",
    "type":"humidity",
    "location":{
         "lat": 45.3819,
         "long": 66.5201
    }
    "status":"inactive"
}
*/
const registerDevice = async (req, res, next) => {
    try {
        const { deviceId, type, location, status } = req.body;

        if (!deviceId) {
            return next(new AppError("DeviceId is required", 400));
        }
        if (!type) {
            return next(new AppError("Type is required", 400));
        }
        if (!location || typeof location !== 'object') {
            return next(new AppError("Location is required", 400));
        }
        if (location.lat === undefined || location.long === undefined) {
            return next(new AppError("Lat and Long are required", 400));
        }
        if (typeof location.lat !== "number" || typeof location.long !== "number") {
            return next(new AppError("Lat and Long must be numbers", 400));
        }
        if (status && !["active", "inactive"].includes(status)) {
            return next(new AppError("Invalid status value", 400));
        }

        const existingDevice = await Device.findOne({ deviceId });

        if (existingDevice) {
            return next(new AppError("Device already exists", 400));
        }

        const device = await Device.create({ deviceId, type, location, status });

        res.status(201).json({
            status: "SUCCESS",
            message: "Device registered successfully",
            device
        });
    } catch (error) {
        next(error);
    }
}

const getDeviceById = async (req, res, next) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId });

        if (!device) {
            return next(new AppError("Device not found", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            device
        })

    } catch (error) {
        next(error);
    }
}

const updateDeviceStatusById = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const { status } = req.body;

        const device = await Device.findOne({ deviceId });

        if (!device) {
            return next(new AppError("Device not found", 404));
        }

        if (!status) {
            return next(new AppError("Status is required", 400));
        }

        if (!["active", "inactive"].includes(status)) {
            return next(new AppError("Invalid status value", 400));
        }

        const updateDevice = await Device.findOneAndUpdate(device, { status }, { new: true })

        res.status(200).json({
            status: "SUCCESS",
            updateDevice
        })
    } catch (error) {
        next(error);
    }
}

const listDevices = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, status, type } = req.query;

        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return next(new AppError("Page and Limit must be positive numbers", 400));
        }

        if (status && !["active", "inactive"].includes(status)) {
            return next(new AppError("Invalid status filter", 400));
        }

        if (type && !["temperature", "humidity", "motion"].includes(type)) {
            return next(new AppError("Invalid type filter", 400));
        }

        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const devices = await Device.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: "SUCCESS",
            devices
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { registerDevice, getDeviceById, updateDeviceStatusById, listDevices }