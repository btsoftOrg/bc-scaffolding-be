const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');

router.use('/user', userRoutes);

router.use('/', (req, res) => {
    res.json('Route not found');
});

module.exports = router;
