const {Router} = require('express');
const {check} = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/authControllers');
const {validateFields} = require('../middlewares/validateFields');
const {validateJwt} = require('../middlewares/validateJwt');

const router = Router();

router.post('/new',
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required and should have @ and .something').isEmail(),
    check('password', 'Password should be longer than 6').not().isEmpty().isLength({min: 6}),
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

module.exports = router;