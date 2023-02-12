const {response} = require('express');
const mongoose = require('mongoose');
const Bug = require('../models/Bug');
const Project = require('../models/Project');
const User = require('../models/User');
const { HttpError } = require('../utils/httpError');

const createBug = async(req, res = response, next) => {

    try {
        const {project:projectId} = req.body;
        const newBug = new Bug(req.body);
        
        newBug.user = mongoose.Types.ObjectId(req.uid);

        newBug.project = mongoose.Types.ObjectId(projectId);
        await newBug.save();
        await Project.findByIdAndUpdate(projectId, {$push: {bugs: newBug}});
        await User.findByIdAndUpdate(req.uid, {$push: {bugs: newBug}});

        const returnedBug = await Bug.findById(newBug._id).populate([
            {path: 'assignedTo', select: 'name'},
            {path: 'user', select: 'name role avatar'},
            {path: 'project', select: 'name leader'}
        ]);

        return res.status(201).json({
            ok: true,
            bug: returnedBug
        });

    } catch (error) {
        return next(error);
    }
};

const getBug = async(req, res = response, next) => {

    try {

        const bugId = req.params.id;
        const bug = await Bug.findById(bugId).populate([
            {path: 'assignedTo', select: 'name'},
            {path: 'user', select: 'name role avatar'},
            {path: 'project', select: 'name leader'}
        ]);

        if(!bug) {
            return next(new HttpError('No bug with this id', 404));
        }

        return res.status(200).json({
            ok: true,
            bug
        })
        
    } catch (error) {
        return next(error);
    }

};

const updateBug = async(req, res = response, next) => {

    try {
        
        const bugId = req.params.id;
        const bug = await Bug.findById(bugId)
        const {...toUpdateData} = req.body;
        
        if(!bug) {
            return next(new HttpError('No bug with this id', 404));
        }
        
        await bug.updateOne(toUpdateData)

        return res.status(200).json({
            ok: true,
            msg: 'Bug updated',
            bugId: bug._id,
            project: bug.project
        });

    } catch (error) {
        return next(error);
    }
};

const deleteBug = async(req, res = response, next) => {

    try {

        const bugId = req.params.id;
        const bug = await Bug.findByIdAndDelete(bugId);
        const projectId = bug.project.toString();

        if(!bug) {
            return next(new HttpError('No bug with this id', 404));
        }
        
        const project = await Project.findById(projectId);
        const updatedBugs = project.bugs.filter(bugId => {
            return bugId.toString() !== bug.id
        });
        await Project.findByIdAndUpdate(projectId, {bugs: updatedBugs});

        return res.status(200).json({
            ok: true,
            msg: 'Bug deleted',
            project: projectId
        });
        
    } catch (error) {
        return next(error);
    }
};

const assignBug = async(req, res = response, next) => {
    try {
        const {member} = req.body;
        const {id} = req.params;
        
        const bug = await Bug.findById(id);
        if(!bug) {
            return next(new HttpError('No bug with this id', 404));
        }

        const user = User.findById(member);
        if(!user) {
            return next(new HttpError('No user with this id', 404));
        }

        await Bug.findByIdAndUpdate(id, {assignedTo: member})

        return res.status(200).json({
            ok: true
        });

    } catch(error) {
        return next(error);
    }
}

module.exports = {
    createBug,
    deleteBug,
    getBug,
    updateBug,
    assignBug
}