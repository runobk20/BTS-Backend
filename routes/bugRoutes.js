const { Router } = require('express');
const router = Router();
const { checkBug } = require('../middlewares/validateBug');
const { createBug, updateBug, getBug, deleteBug, assignBug } = require('../controllers/bugControllers');

const { validateJwt } = require('../middlewares/validateJwt');
const { validateFields } = require('../middlewares/validateFields');
const { isAdmin } = require('../middlewares/isAdmin');

router.post('/new', [
    validateJwt,
    checkBug,
    validateFields
], createBug);

router.get('/:id', validateJwt, getBug);

router.put('/:id', validateJwt, updateBug);

router.delete('/:id', validateJwt, deleteBug);

router.put('/:id/assign', 
[
    validateJwt,
    isAdmin
], 
assignBug);

module.exports = router;