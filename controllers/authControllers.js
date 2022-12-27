const {response} = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/generateToken');

const createUser = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already in use'
            })
        }
        
        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
    
        await user.save();

        const token = await generateToken(user.id, user.name);

        const {id:uid, name, ownProjects, projects} = user;
        
        console.log(user)
        return res.status(201).json({
            ok: true,
            uid,
            name,
            ownProjects,
            projects,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please talk with an Admin'
        })
    }



}

const loginUser = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No user with this email.'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) {

            return res.status(401).json({
                ok: false,
                msg: 'Not a valid password'
            });

        }

        const token = await generateToken(user.id, user.name);

        const {uid, name, ownProjects, projects} = user;

        return res.status(200).json({
            ok: true,
            uid,
            name,
            ownProjects,
            projects,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong.'
        })
    }
}

const revalidateToken = async(req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generateToken(uid, name);


    return res.status(200).json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}