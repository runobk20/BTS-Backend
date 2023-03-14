const {response} = require('express');
const mongoose = require('mongoose');
const Bug = require('../models/Bug');
const Project = require('../models/Project');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { HttpError } = require('../utils/HttpError');

const createBug = async(req, res = response, next) => {

    if(req.role === 'developer') return next(new HttpError('This action is available for testers only.'));

    try {
        const {project:projectId} = req.body;
        const newBug = new Bug(req.body);
        
        newBug.user = mongoose.Types.ObjectId(req.id);

        newBug.project = mongoose.Types.ObjectId(projectId);
        await newBug.save();
        await Project.findByIdAndUpdate(projectId, {$push: {bugs: newBug}});
        await User.findByIdAndUpdate(req.id, {$push: {bugs: newBug}});

        const returnedBug = await Bug.findById(newBug._id).populate([
            {path: 'assignedTo', select: 'name'},
            {path: 'user', select: 'name role avatar'},
            {path: 'project', select: 'name leader'},
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
            {path: 'project', select: 'name leader'},
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

    if(req.role === 'developer') return next(new HttpError('This action is available for testers only.'));

    try {

        const bugId = req.params.id;
        const bug = await Bug.findById(bugId);
        const projectId = bug.project.toString();
        
        if(!bug) return next(new HttpError('No bug with this id', 404));

        await Bug.findByIdAndDelete(bugId);
        
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
        if(!bug) return next(new HttpError('No bug with this id', 404));

        const user = User.findById(member);
        if(!user) return next(new HttpError('No user with this id', 404));

        await User.findByIdAndUpdate(member, {$push: {bugs: bug._id}});

        await Bug.findByIdAndUpdate(id, {assignedTo: member})

        return res.status(200).json({
            ok: true,
            msg: 'User assigned'
        });

    } catch(error) {
        return next(error);
    }
}

const addComment = async(req, res = response, next) => {
    try {
        const {uid} = req;
        const {bugId, comment} = req.body;
        const bug = await Bug.findById(bugId);
        if(!bug) return next(new HttpError('No bug with this id', 404));

        const user = await User.findById(uid);
        if(!user) return next(new HttpError('No user with this id', 404));

        const newComment = new Comment();
        newComment.user = {name: user.name, avatar: user.avatar, role: user.role, id: user.id || user._id};
        newComment.bug = mongoose.Types.ObjectId(bugId);
        newComment.content = comment;
        await newComment.save();

        await Bug.findByIdAndUpdate(bugId, {$push: {comments: newComment}});

        return res.status(201).json({
            ok: true,
            comment: newComment
        });

    } catch (error) {
        return next(error);
    }
}

const deleteComment = async(req, res = response, next) => {
    try {
        const userId = req.id;
        const {commentId, commentCreator, commentBug} = req.body;
        const parsedComId = mongoose.Types.ObjectId(commentId);

        const user = await User.findById(userId);
        if(!user) return next(new HttpError('No user with this id', 404));

        if(commentCreator !== userId) return next(new HttpError('You need to be the creator to delete a comment', 403));

        const comment = await Comment.findByIdAndDelete(parsedComId);
        if(!comment) return next(new HttpError('No comment with this id', 404));

        const bug = await Bug.findByIdAndUpdate(commentBug)
        const updatedComments = bug.comments.filter(comment => {
            return comment._id.toString() !== commentId;
        })
        await Bug.findByIdAndUpdate(commentBug, {comments: updatedComments});
        
        return res.status(200).json({
            ok: true,
            msg: 'Comment deleted'
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
    assignBug,
    addComment,
    deleteComment
}