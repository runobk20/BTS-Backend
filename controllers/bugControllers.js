const {response} = require('express');
const Bug = require('../models/Bug');
const Project = require('../models/Project');

const createBug = async(req, res = response) => {

    try {
        const {project:projectId} = req.body;
        const newBug = new Bug(req.body);
        
        newBug.user = {
            name: req.name,
            id: req.uid
        }

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

const getBug = (req, res = response) => {
    return res.json({
        ok: true
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