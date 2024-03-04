const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const Admin = require('@models/Admin');
const adminMiddleware = require('@middleware/admin');



router.use('/admin', require('@routes/admin'));
router.use('/user', require('@routes/user')); 

module.exports = router;

