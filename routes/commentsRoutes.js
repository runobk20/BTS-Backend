const {Router} = require('express');
const { check } = require('express-validator');
const {validateJwt} = require('../middlewares/validateJwt');
const {addComment, deleteComment} = require('../controllers/bugControllers');


const router = Router();

router.post('/add', [
    check('user', 'User is required').not().isEmpty(),
    check('bug', 'Bug is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty().isLength({max: 140}),
    validateJwt
],
addComment);

router.delete('/delete', validateJwt, deleteComment);

module.exports = router;