class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.ok = false;
    }
}

module.exports = {
    HttpError
}