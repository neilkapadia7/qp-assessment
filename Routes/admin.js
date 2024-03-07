const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const AdminController = require('@controllers/AdminController');
const UserController = require('@controllers/UsersController');
const auth = require('@middleware/auth');


// @route   POST    api/admin/getAllProducts
// @desc    Get All Product
// @access  Private
router.get('/getAllProducts', 
	auth,
	async (req, res) => UserController.getAllProducts(req, res)
);

// @route   POST    api/admin/getProductById
// @desc    get product by Id
// @access  Private
router.get('/getProductById/:id', 
	auth,
	async (req, res) => UserController.getProductById(req, res)
);


// @route   POST    api/admin/updateProduct
// @desc    Update Product
// @access  Private
router.post('/updateProduct', 
	auth,
    [
        check('productId', 'Please Add A ProductId').isString(),
        check('isActive', 'Please Add Active Status').isBoolean().optional(),
        check('remainingItems', 'Please Add Remaining Items').isNumeric().optional(),
        check('cost', 'Please Add Cost').isNumeric().optional(),
    ],
	async (req, res) => {
        if(!req.isAdminUser) {
            return res.status(400).json({ msg: "Invalid Access" });
        }

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

        AdminController.updateProduct(req, res);
    }
);


// @route   POST    api/admin/addProduct
// @desc    Add Product
// @access  Private
router.post('/addProduct', 
	auth,
    [
        check('name', 'Please Add A Name').isString(),
        // check('isActive', 'Please Add Active Status').isBoolean(),
        check('remainingItems', 'Please Add Remaining Items').isNumeric(),
        check('cost', 'Please Add Students').isNumeric()
    ],
	async (req, res) => {
        if(!req.isAdminUser) {
            return res.status(400).json({ msg: "Invalid Access" });
        }
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

        AdminController.addProduct(req, res);
    }
);



// @route   POST    api/admin/loginUser
// @desc    loginUser
// @access  Public
router.post('/loginUser', 
    [
        check('email', 'Please Add Email').isString(),
        check('password', 'Please Add Password').isString(),
    ],
	async (req, res) => {
        
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

        AdminController.loginUser(req, res);
    }
);


// @route   POST    api/admin/createUser
// @desc    CreateUser
// @access  Public
router.post('/createUser', 
    [
        check('name', 'Please Add A Name').isString(),
        check('email', 'Please Add Email').isString(),
        check('password', 'Please Add Password').isString(),
        check('isAdminUser', 'Please Admin Value').isBoolean(),
    ],
	async (req, res) => {
        
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

        AdminController.createUser(req, res);
    }
);

module.exports = router;
