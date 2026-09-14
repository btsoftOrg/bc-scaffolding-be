const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/me', UserController.me);

module.exports = router;
