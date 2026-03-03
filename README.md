# IoT Device Data Management System

## Overview

This project is a **backend system for managing IoT devices and telemetry data**.  
It provides APIs to:

- Register devices with unique IDs, type, location, and status.
- Update device status (active/inactive).
- Retrieve device details.
- List devices with pagination and filters.
- Insert telemetry data (single or bulk).
- Query telemetry data within a date range.
- Compute statistics for telemetry metrics (temperature, humidity, battery).
- Find devices with low battery.
- Find offline devices (not reporting in last 15 minutes).

---

## Technologies Used

- **Node.js** & **Express.js** – Backend framework
- **MongoDB** & **Mongoose** – Database & ODM
- **Postman ** – API testing & documentation
- **dotenv** – Environment variables

---

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/AbidDhankwala123/IoT-Device-Data-Management-System.git
cd <repo-folder>

2. Install Dependencies

npm install

3. Install Packages

npm i express mongoose dotenv

4. Create .env

MONGO_URI=<your_mongodb_connection_string>
PORT=5000

5. Start Server

npm run dev

Runs on http://localhost:5000.

1. Device APIs
a. Register Device

Endpoint: POST /devices

Body:

{
  "deviceId": "dev-101",
  "type": "temperature",
  "location": { "lat": 19.076, "long": 72.8777 },
  "status": "active"
}

Response: Newly created device object.

b. Get Device by ID

Endpoint: GET /devices/:deviceId

Response: Device details.

c. Update Device Status

Endpoint: PATCH /devices/:deviceId/status

Body:

{ "status": "inactive" }

Response: Updated device object.

d. List Devices (Pagination + Filters)

Endpoint: GET /devices?page=1&limit=10&type=temperature&status=active

Response: Array of devices matching filters.

2. Telemetry APIs
a. Insert Telemetry

Endpoint: POST /telemetry

Body:

{
  "deviceId": "dev-101",
  "timestamp": "2026-03-01T10:30:00Z",
  "metrics": { "temperature": 25.5, "humidity": 60, "battery": 92 }
}

Validation: deviceId required, timestamp valid, at least one metric, metrics must be numbers.

Response: Inserted telemetry record.

b. Bulk Insert Telemetry

Endpoint: POST /telemetry/bulk

Body:

{
  "data": [
    { "deviceId":"dev-101", "timestamp":"2026-03-01T10:30:00Z", "metrics":{"temperature":25.5,"humidity":60,"battery":92} },
    { "deviceId":"dev-102", "timestamp":"2026-03-01T11:00:00Z", "metrics":{"temperature":28.2,"humidity":55,"battery":80} }
  ]
}

Validation: Array non-empty, each item valid (same as single insert).

c. Get Telemetry by Date Range

Endpoint: GET /telemetry/:deviceId?start=2026-03-01T00:00:00Z&end=2026-03-10T23:59:59Z

Response: Telemetry records within range.

Validation: start/end required, valid dates, deviceId exists.

d. Get Telemetry Statistics

Endpoint: GET /telemetry/:deviceId/stats?start=2026-03-01T00:00:00Z&end=2026-03-10T23:59:59Z&metric=temperature

Response: Average, min, max of the metric.

Validation: Metric must be one of temperature, humidity, battery.

e. Low Battery Devices

Endpoint: GET /alerts/low-battery?threshold=20

Response: Devices with battery less than threshold.

f. Offline Devices

Endpoint: GET /alerts/offline-devices

Logic: Devices whose last telemetry is older than 15 minutes.
