const jwt = require('jsonwebtoken');

const generateToken = (uid, name, role) => {

    return new Promise((resolve, reject) => {

        const payload = {uid, name, role};

        jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('Could not generate token...');
            }

            resolve(token);
        });
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    generateToken
}