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
git clone <your-repo-link>
cd <repo-folder>
