const {Router} = require('express');
const {check} = require('express-validator');
const { createProject, getProject, addProjectMember, removeProjectMember, deleteProject } = require('../controllers/projectsControllers');

const {validateFields} = require('../middlewares/validateFields');
const {validateJwt} = require('../middlewares/validateJwt');

const router = Router();

router.post('/new', 
[
    check('name', 'Name is required and should be less than 40 characters').not().isEmpty().isLength({max: 40}),
    check('description', 'Description is required and should be less than 250 characters').not().isEmpty().isLength({max: 250}),
    validateFields,
    validateJwt
], 
createProject);

router.get('/:id', validateJwt, getProject);

router.post('/:id/add-member',
[
    check('email', 'Should be a valid email').isEmail(),
    validateFields,
    validateJwt
],
addProjectMember);

router.put('/:id/remove-member',[
    check('email', 'Should be a valid email').isEmail(),
    validateJwt
],
removeProjectMember);

router.delete('/:id', validateJwt, deleteProject);

module.exports = router;