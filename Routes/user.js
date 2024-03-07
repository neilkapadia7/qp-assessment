const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const UserController = require('@controllers/UsersController');
const auth = require('@middleware/auth');


// @route   POST    api/user/getAllProducts
// @desc    Get All Active Product
// @access  Private
router.post('/getAllProducts', 
	auth,
	async (req, res) => UserController.getAllProducts(req, res)
);

// @route   get    api/user/getProductById
// @desc    Get Product By Id
// @access  Private
router.get('/getProductById/:id', 
	auth,
	async (req, res) => UserController.getProductById(req, res)
);


// @route   POST    api/user/addProductToCart
// @desc    Add Product to Cart
// @access  Private
router.post('/addProductToCart', 
	auth,
    [
        check('productId', 'Please Add A ProductId').isString(),
    ],
	async (req, res) => {

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

        UserController.addProductToCart(req, res);
    }
);


// @route   POST    api/user/reemoveProductFromCart
// @desc    Update Products in Cart
// @access  Private
router.post('/reemoveProductFromCart', 
	auth,
    [
        check('productId', 'Please Add A ProductId').isString(),
    ],
	async (req, res) => {

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

        UserController.removeProductFromCart(req, res);
    }
);


// @route   POST    api/user/purchaseProducts
// @desc    Move Cart to Orders
// @access  Private
router.post('/purchaseProducts', 
	auth,
    [
        check('products', 'Please Add A Products').isArray(),
    ],
	async (req, res) => {

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

        UserController.purchaseProducts(req, res);
    }
);


module.exports = router;
