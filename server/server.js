const express = require("express");
const mongoose = require("mongoose");
const errorCheck = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).json({
        service: "IoT Device Data Management System",
        status: "ACTIVE",
        time: new Date(),
    })
})

app.use("/", require("./routes/deviceRoutes"));
app.use("/", require("./routes/telemetryRoutes"));

//Handling Error Midddleware
app.use(errorCheck);

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running successfully on http://localhost:${process.env.PORT}`))
        .catch(error => console.log(error))
})
