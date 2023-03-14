const {Router} = require('express');
const {check} = require('express-validator');
const { createUser, loginUser, revalidateToken, getUser, deleteUser } = require('../controllers/authControllers');
const {validateFields} = require('../middlewares/validateFields');
const {validateJwt} = require('../middlewares/validateJwt');

const router = Router();

router.post('/new',
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required and should have @ and .something').isEmail(),
    check('password', 'Password should be longer than 6').not().isEmpty().isLength({min: 6}),
    check('role', 'Role is required').not().isEmpty(),
    validateFields
],
createUser);

router.post('/login',
[
    check('email', 'Should login with an email').isEmail(),
    check('password', 'Password should be longer than 6').isLength({min: 6}),
    validateFields
],
loginUser);

router.get('/renew', validateJwt, revalidateToken);

router.get('/', validateJwt, getUser);

router.delete('/', validateJwt, deleteUser);

module.exports = router;