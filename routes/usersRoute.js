const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);

module.exports = router
