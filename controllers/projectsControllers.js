const {response} = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { HttpError } = require('../utils/httpError');

const createProject = async(req, res = response, next) => {

    const user = await User.findById(req.uid);
    const {ownProjects} = user;

    if(ownProjects.length >= 2) {
        return next(new HttpError('Maximum quantity of projects reached, delete one or more to create a new one', 409));
    }

    try {
        const project = new Project(req.body);

        project.leader = req.uid;

        await project.save();

        await User.findByIdAndUpdate(req.uid, {$push: {ownProjects: project.id}}, {new: true});

        return res.status(201).json({
            ok: true,
            name: project.name,
            projectId : project.id
        });
        
    } catch (error) {
        return next(error);
    }

}

const getProject = async(req, res = response, next) => {

    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId).populate([
            { path: 'members', select:'name role avatar' },
            { path: 'bugs' },
            { path: 'leader', select: 'name role avatar' }
        ]);

        if(!project) {
            return next(new HttpError('No project found with this id', 404));
        }

        return res.status(200).json({
            ok: true,
            project
        });

    } catch (error) {
        return next(error);
    }

}

const addProjectMember = async(req, res = response, next) => {

    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) return next(new HttpError('No user with this email', 404));
    
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if(!project) return next(new HttpError('No project with this id', 404));
    
        const isMember = project.members.some(member => member.id === user.id);
        if(isMember) return next(new HttpError('This user is already a member of the project', 400));
    
        const updatedProject = await Project.findByIdAndUpdate(projectId, {$push: {members: user.id}}, {new: true});
        if(!updatedProject) return next(new HttpError('Something went wrong, please try again later', 500));

        await User.findOneAndUpdate({email}, {$push: {projects: projectId}})
    
        return res.status(200).json({
            ok: true,
            msg: 'User added'
        });

    } catch (error) {
        return next(error);
    }
}

const removeProjectMember = async(req, res = response, next) => {

    const uid = req.body.uid;
    const projectId = req.params.id;


    try {
        const project = await Project.findById(projectId);

        if(!project) return next(new HttpError('No project with this id', 404));
        if(project.leader.toString() !== req.uid) return next(new HttpError('Only the leader can remove members', 403));

        const user = await User.findById(uid);
        if(!user) return next(new HttpError('No user with this email', 404));

        const isMember = project.members.some(member => member.toString() === user.id);
        if(!isMember) return next(new HttpError('This user is not a member of the project', 400));

        const updatedMemberProjects = user.projects.filter(project => project.toString() !== projectId);
        await User.findOneAndUpdate({id: user.id}, {projects: updatedMemberProjects});

        const updatedProjectMembers = project.members.filter(memberId => memberId.toString() !== user.id);
        await Project.findOneAndUpdate({id: projectId}, {members: updatedProjectMembers});

        return res.status(200).json({
            ok: true
        });

    } catch (error) {
        return next(error);
    }
}

const deleteProject = async(req, res = response, next) => {

    
    const project = await Project.findById(req.params.id);

    if(!project) {
        return next(new HttpError('No project with this id', 404));
    }

    if(project.leader.toString() !== req.uid) {
        return next(new HttpError('To delete a project, you need to be the leader.', 403));
    }

    try {
        const user = await User.findById(req.uid);
        const updatedOwnProjects = user.ownProjects.filter(el => {
            return el.toString() !== req.params.id;
        });

        await User.findByIdAndUpdate(user._id.toString(), {ownProjects: updatedOwnProjects});
        
        await Project.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            ok: true,
            msg: 'Project deleted'
        });
        
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    addProjectMember,
    removeProjectMember,
    createProject,
    deleteProject,
    getProject
}