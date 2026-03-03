const errorCheck = (error, req, res, next) => {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const errorMessage = error.message ? error.message : "Internal Server Error";

    res.status(statusCode).json({ errorMessage });
}

module.exports = errorCheck