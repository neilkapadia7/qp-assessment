const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { check, validationResult } = require('express-validator');

const router = express.Router();
// const Admin = require('@models/Admin');
// const adminMiddleware = require('@middleware/admin');



// router.use('/admin', require('@routes/admin'));
// router.use('/admin/auth', require('@routes/adminauth')); 
router.use('/admin', console.log("TEST"));
// router.use('/admin/auth', require('@routes/adminauth')); 

module.exports = router;

