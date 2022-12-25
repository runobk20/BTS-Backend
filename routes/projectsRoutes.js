const {Router} = require('express');
const {check} = require('express-validator');
const { createProject, getProject, addMemberToProject } = require('../controllers/projectsControllers');

const {validateFields} = require('../middlewares/validateFields');
const {validateJwt} = require('../middlewares/validateJwt');

const router = Router();

router.post('/new', validateJwt, createProject);

router.get('/:id', validateJwt, getProject);

router.put('/:id/add-member', addMemberToProject);

module.exports = router;