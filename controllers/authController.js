const {response} = require('express');

const createUser = (req, res = response) => {

    const {name, email, password} = req.body;

    return res.status(200).json({
        ok: true,
        name,
        email,
        password
    })

}

const loginUser = (req, res = response) => {

    const {email, password} = req.body;

    return res.status(200).json({
        ok: true,
        email,
        password
    })

}

const revalidateToken = (req, res = response) => {

    return res.status(200).json({
        ok: true,
        msg: 'Renewing token...'
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}