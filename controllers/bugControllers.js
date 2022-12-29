const {response} = require('express');
const mongoose = require('mongoose');
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
};

const updateBug = (req, res = response) => {
    return res.json({
        ok: true
    })
};

const deleteBug = (req, res = response) => {
    return res.json({
        ok: true
    })
};

module.exports = {
    createBug,
    deleteBug,
    getBug,
    updateBug
}