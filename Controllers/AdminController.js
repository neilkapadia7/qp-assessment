const Groceries = require('@models/Groceries');
const Users = require('@models/Users');

module.exports = {
    
    async updateProduct(req, res) {
        try {
            let {productId, isActive, remainingItems, cost} = req.body;
            let product = await Groceries.findById(productId);

            if (!product) {
                return res.status(404).json({msg: 'Product not found!'});
            }

            if (req.body.hasOwnProperty('isActive')) {
                product.isActive = isActive;
            }

            if (req.body.hasOwnProperty('remainingItems')) {
                product.remainingItems = remainingItems;
            }

            if (req.body.hasOwnProperty('cost')) {
                product.cost = cost;
            }

            await product.save()
            
            return res.status(200).json({product, msg: "Success"});

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },
    
    async addProduct(req, res) {
        try {
            let {name, remainingItems, cost} = req.body;
            let product = await Groceries.findOne({name: name, isActive: true});
            
            if (product) {
                return res.status(404).json({msg: 'Product already exists!'});
            }

            
            product = await new Groceries({
                adminUserId: req.userId,
                name, 
                remainingItems,
                cost,
                isActive: true
            })

            await product.save()
            
            return res.status(200).json({product, msg: "Success"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server Error', error: error.message });    
        }
    },

};