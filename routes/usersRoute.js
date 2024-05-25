const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/users/signup', userController.createUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', auth, userController.logoutUser);

module.exports = router
