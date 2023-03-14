const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const validateJwt = (req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token in request.'
        });
    }

    try {
        const { uid, name, role } = jwt.verify(token, process.env.TOKEN_SECRET);
        req.id = uid;
        req.name = name;
        req.role = role;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }

    next();
}

module.exports = {
    validateJwt
}