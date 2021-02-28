module.exports = function (req, res, next) {
    res.success = function (message, data, statusCode) {
        return res.status(Number(statusCode || 200)).json({
            success: true,
            message: message,
            data: data || null
        })
    }
    next();
}