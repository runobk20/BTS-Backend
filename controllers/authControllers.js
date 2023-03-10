const {response} = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/generateToken');
const { HttpError } = require('../utils/HttpError');

const createUser = async(req, res = response, next) => {

    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});

        if(user) {
            return next(new HttpError('Email already in use', 400));
        }
        
        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        user.avatar = `https://ui-avatars.com/api/?name=${req.body.name}&size=150&background=random`;
    
        await user.save();

        const token = await generateToken(user.id, user.name);

        const {id:uid, name, ownProjects, projects, role, avatar} = user;
        
        return res.status(201).json({
            ok: true,
            uid,
            name,
            role,
            avatar,
            ownProjects,
            projects,
            token
        });
        
    } catch (error) {
        next(error);
    }
}

const loginUser = async(req, res = response, next) => {

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email}).populate([
            { path: 'ownProjects', select: 'name' },
            { path: 'projects', select: 'name'},
            { 
                path: 'bugs', 
                populate:[
                    {path: 'title'},
                    {path: 'project', select: 'name'},
                    {path: 'status'},
                    {path: 'priority'},
                    {path: 'severity'},
                    {path: 'user', select: 'name'}
            ]}
        ]);
        if(!user) {
            return next(new HttpError('No user with this email', 404));
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) {
            return next(new HttpError('Invalid password', 401));
        }

        const token = await generateToken(user.id, user.name);

        const {_id:uid, name, ownProjects, projects, avatar, role, bugs} = user;

        return res.status(200).json({
            ok: true,
            uid,
            name,
            role,
            avatar,
            ownProjects,
            projects,
            bugs,
            token
        });


    } catch (error) {
        return next(error);
    }
}

const revalidateToken = async(req, res = response) => {

   try {
        let user = await User.findById(req.uid).populate([
            { path: 'ownProjects', select: 'name' },
            { path: 'projects', select: 'name'},
            { 
                path: 'bugs', 
                populate:[
                    {path: 'title'},
                    {path: 'project', select: 'name'},
                    {path: 'status'},
                    {path: 'priority'},
                    {path: 'severity'},
                    {path: 'user', select: 'name'},
                    {path: 'comments', populate: [{
                        path: 'user', select: 'name avatar'
                    }]}
            ]}
        ]);

        if(!user) return next(new HttpError('No user with this email', 404));

        const {_id:uid, name, ownProjects, projects, avatar, role, bugs} = user;

        const token = await generateToken(uid, name);

        return res.status(200).json({
            ok: true,
            uid,
            name,
            role,
            avatar,
            ownProjects,
            projects,
            bugs,
            token
        });

   } catch (error) {
        console.log(error);
        return next(error);
   }
}

const getUser = async(req, res = response, next) => {
    
    const id = req.body.uid;
    try {
        let user = await User.findById(id).populate([
            { path: 'ownProjects', select: 'name' },
            { path: 'projects', select: 'name'},
            { path: 'bugs', select: 'title project status priority severity'}
        ]);

        if(!user) {
            return next(new HttpError('No user found', 404));
        }

        const {_id:uid, name, ownProjects, projects, avatar, role, bugs} = user;

        return res.status(200).json({
            ok: true,
            uid,
            name,
            ownProjects,
            projects,
            avatar,
            role,
            bugs
        });
        
    } catch (error) {
        return next(error);
    }
}

const deleteUser = async(req, res = response, next) => {

    try {

        const { uid } = req.body;
        const user = await User.findById(uid);

        if(!user) return next(new HttpError('No user with this id', 404));

        await User.findByIdAndDelete(uid);

        return res.status(200).json({
            ok: true,
            msg: 'User deleted successfully'
        });
        
    } catch (error) {
        return next(error);
    }

}

module.exports = {
    createUser,
    deleteUser,
    getUser,
    loginUser,
    revalidateToken
}