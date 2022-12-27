const {response} = require('express');
const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async(req, res = response) => {

    const user = await User.findById(req.uid);
    const {ownProjects} = user;

    if(ownProjects.length >= 2) {
        return res.status(403).json({
            ok: false,
            msg: 'Maximum quantity of projects reached, delete to create a new one'
        });
    }

    try {
        const project = new Project(req.body);

        await project.save();

        await User.findByIdAndUpdate(req.uid, {$push: {ownProjects: project.id}}, {new: true});

        return res.status(201).json({
            ok: true,
            name: project.name,
            projectId : project.id
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please talk with an Admin'
        })
    }

}

const getProject = async(req, res = response) => {

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    console.log(projectId);

    if(!project) {
        return res.status(404).json({
            ok: false,
            msg: 'No project found with this ID'
        });
    }

    return res.status(200).json({
        ok: true,
        project
    });

}

const addMemberToProject = async(req, res = response) => {

    const {email} = req.body;
    const user = await User.findOne({email});
    const newMember = {
        id: user.id,
        name: user.name
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    const isMember = project.members.some(member => member.id === newMember.id);

    if(isMember) {

        return res.status(400).json({
            ok: false,
            msg: 'This user is already a member of the project'
        });

    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, {$push: {members: newMember}}, {new: true});

    if(!updatedProject) {
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong, please try later'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: 'User added'
    });
}

module.exports = {
    createProject,
    getProject,
    addMemberToProject
}