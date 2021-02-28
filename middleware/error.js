module.exports = function (req, res, next) {
    res.error = function (errorMessage, statusCode) {
        return res.status(statusCode || 404).json({
            success: false,
            error: errorMessage,
        })
    }
    next();
}