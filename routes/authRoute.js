const {Router} = require('express');
const router = Router();
const { createUser, loginUser, revalidateToken } = require('../controllers/authController');


router.post('/new', createUser);

router.post('/login', loginUser);

router.get('/renew', revalidateToken);

module.exports = router;