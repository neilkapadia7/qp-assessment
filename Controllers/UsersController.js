const Groceries = require('@models/Groceries')
const Carts = require('@models/Carts')
const Orders = require('@models/Orders')
const Users = require('@models/Users')


module.exports = {
    async getAllProducts(req, res) {
        try {
            let { page, search } = req.body;
            let query = {};

            if(!req.isAdminUser) {
                query = {...query, isActive: true, remainingItems: {$gt: 0}};
            }
      
            if(search) {
                query = {...query, name: { $regex: new RegExp(search, 'i') } };
            }
      
            let pageNo = 1;
            if (page) {
                pageNo = page;
            }
      
            let total = await Groceries.countDocuments(query);
            let products = await Groceries.find(query, {remainingItems: 1, name: 1, cost: 1})
                .skip(25 * pageNo - 25)
                .limit(25)
                .sort({createdAt:-1})
                .lean(); 
      
            return res.status(200).json({products, total, msg: "Success"});

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },
    
    async getProductById(req, res) {
        try {
            let { id } = req.params;
            let products = await Groceries.findById(id);

            if (!products) {
                return res.status(404).json({msg: 'Product not found!'});
            }
            
            return res.status(200).json({products, msg: "Success"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },
    
    async addProductToCart(req, res) {
        try {
            let { productId } = req.body;
            let products = await Groceries.findById(productId);

            if (!products) {
                return res.status(404).json({msg: 'Product not found!'});
            }

            let cart = await Carts.findOne({userId: req.userId});

            if(!cart) {
                cart = await new Carts({
                    userId: req.userId,
                    products:[
                        {
                            productId,
                            quantity: 1
                        }
                    ],
                    totalAmount: products.cost
                }).save();

            } else {
                let index = cart.products.findIndex(el => el.productId.toString() == productId.toString());
                if (index > -1) {
                    cart.products[index].quantity++;
                } else {
                    cart.products.push({
                        productId,
                        quantity: 1
                    });
                }

                cart.totalAmount += products.cost;
                await cart.save();
            }


            return res.status(200).json({cart, msg: "Success"});

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },
    
    async removeProductFromCart(req, res) {
        try {
            let { productId } = req.body;
            let products = await Groceries.findById(productId);

            if (!products) {
                return res.status(404).json({msg: 'Product not found!'});
            }

            let cart = await Carts.findOne({userId: req.userId});

            if(!cart) {
                return res.status(404).json({msg: 'Cart not found!'});

            } else {
                let index = cart.products.findIndex(el => el.productId.toString() == productId.toString());
                if (index > -1 && cart.products[index].quantity > 0) {
                    cart.products[index].quantity--;
                } 
                // Already 0 Quantity so ignore
                // else {
                // }

                cart.totalAmount -= products.cost;
                await cart.save();
            }


            return res.status(200).json({cart, msg: "Success"});

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },
    
    async purchaseProducts(req, res) {
        try {
            let cart = await Carts.findOne({userId: req.userId});

            if(!cart) {
                return res.status(404).json({msg: 'Cart is Empty!'});

            } 

            // Place Order
            // Payment Gateway Services and Stuff will go here before making changes to DB

            let placeOrder = await new Orders({
                userId: req.userId,
                products: cart.products,
                totalAmount: cart.totalAmount
            }).save();

            return res.status(200).json({placeOrder, msg: "Success"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },

};