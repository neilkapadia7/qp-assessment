const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const AdminController = require('@controllers/AdminController');
const auth = require('@middleware/auth');


// @route   POST    api/admin/getAllProducts
// @desc    Get All Product
// @access  Private
router.get('/getAllProducts', 
	auth,
	async (req, res) => AdminController.getAllProducts(req, res)
);

// @route   POST    api/admin/getProductById
// @desc    get product by Id
// @access  Private
router.get('/getProductById/:id', 
	auth,
	async (req, res) => AdminController.getProductById(req, res)
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

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
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
        check('productId', 'Please Add A ProductId').isString(),
        check('isActive', 'Please Add Active Status').isBoolean(),
        check('remainingItems', 'Please Add Remaining Items').isNumeric(),
        check('cost', 'Please Add Students').isNumeric(),
        // check('isActive', 'Please Add Active Status').isBoolean().required(),
        // check('remainingItems', 'Please Add Remaining Items').isNumeric().required(),
        // check('cost', 'Please Add Students').isNumeric().required(),
    ],
	async (req, res) => {

        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

        AdminController.addProduct(req, res);
    }
);

module.exports = router;
