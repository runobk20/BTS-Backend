const {response} = require('express');
const mongoose = require('mongoose');
const { update } = require('../models/Bug');
const Bug = require('../models/Bug');
const Project = require('../models/Project');

const createBug = async(req, res = response) => {

    try {
        const {project:projectId} = req.body;
        const newBug = new Bug(req.body);
        
        newBug.user = mongoose.Types.ObjectId(req.uid);

        newBug.project = mongoose.Types.ObjectId(projectId);

        await newBug.save();
        await Project.findByIdAndUpdate(projectId, {$push: {bugs: newBug}});

        const {id:bugId} = newBug;

        return res.status(201).json({
            ok: true,
            bugId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong, please try again later.'
        });
    }
};

const getBug = async(req, res = response) => {

    try {

        const bugId = req.params.id;
        const bug = await Bug.findById(bugId);
        console.log(bug)

        if(!bug) {
            return res.status(400).json({
                ok: false,
                msg: 'No bug with this id'
            });
        }

        return res.status(200).json({
            ok: true,
            bug
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

};

const updateBug = async(req, res = response) => {

    try {
        
        const bugId = req.params.id;
        const bug = await Bug.findById(bugId)
        const {...toUpdateData} = req.body;
        
        if(!bug) {
            return res.status(400).json({
                ok: false,
                msg: 'No bug with this id'
            });
        }
        
        await bug.updateOne(toUpdateData)

        return res.status(200).json({
            ok: true,
            msg: 'Bug updated'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
};

const deleteBug = async(req, res = response) => {

    try {

        const bugId = req.params.id;
        const bug = await Bug.findOneAndDelete({id: bugId});
        const projectId = bug.project.toString();

        if(!bug) {
            return res.status(400).json({
                ok: false,
                msg: 'No bug with this id'
            });
        }
        
        const project = await Project.findById(projectId);
        const updatedBugs = project.bugs.filter(bugId => {
            return bugId.toString() !== bug.id
        });
        await Project.findByIdAndUpdate(projectId, {bugs: updatedBugs});

        return res.status(200).json({
            ok: true,
            msg: 'Bug deleted'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
};

module.exports = {
    createBug,
    deleteBug,
    getBug,
    updateBug
}