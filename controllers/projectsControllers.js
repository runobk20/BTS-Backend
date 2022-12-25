const {response} = require('express');
const Project = require('../models/Project');

const createProject = async(req, res = response) => {

    //TODO: Manejar maximo de proyectos por miembro, probablemente 2.

    try {

        const project = new Project(req.body);

        await project.save();

        return res.status(201).json({
            ok: true,
            project
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

    if(!project) {
        return res.status(404).json({
            ok: false,
            msg: 'No project found with this ID'
        })
    }

    return res.status(200).json({
        ok: true,
        project
    })

}

const addMemberToProject = async(req, res = response) => {

}

module.exports = {
    createProject,
    getProject,
    addMemberToProject
}