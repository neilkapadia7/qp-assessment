const Groceries = require('@models/Groceries');
const Users = require('@models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Add new user
    async createUser(req, res) {
        const { name, email, password, isAdminUser } = req.body;

		try {
			let user = await Users.findOne({ email });

			if (user) {
				return res.status(400).json({ msg: 'User with email already exists' });
			}

            const salt = await bcrypt.genSalt(10);

			let newPassword = await bcrypt.hash(password, salt);

            let newUser = await new Users({
                name,
                email,
                password: newPassword,
                isAdminUser,
            }).save()

            const payload = {
				user: {
					id: newUser._id,
				},
			};

            let jwttoken = null;

			jwt.sign(
				payload,
				process.env.JWTSecret,
				{
					expiresIn: 3600,
				},
				(err, token) => {
					if (err) throw err;
					jwttoken = token
				}
			);

            return res.status(200).json({ 
                token: jwttoken,
                ...newUser,
                password: null
            });
            
			
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
		}
    },

    async loginUser(req, res) {
        const { email, password } = req.body;

		try {
			let user = await Users.findOne({ email });

			if (!user) {
				return res.status(400).json({ msg: 'Invalid Email Id / User not found' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid Password' });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.JWTSecret,
				{
					expiresIn: 3600,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
		}
    },

};