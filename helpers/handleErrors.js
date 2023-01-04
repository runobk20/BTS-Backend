function handleErrors(err, req, res, next) {
    console.log(err);
    const {ok, message, statusCode} = err;
    const sendErr = {ok: Boolean(ok), msg: message || 'Internal server error'}
    return res.status(statusCode || 500).json(sendErr);
}

module.exports = {
    handleErrors
}