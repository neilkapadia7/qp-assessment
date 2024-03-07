const jwt = require('jsonwebtoken');
const Users = require("@models/Users");

module.exports = async function (req, res, next) {
	const token = req.header('x-auth-token');

	if (!token) {
		return res.status(402).json({ msg: 'No Token, Authorization Denied' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWTSecret);

		req.userId = decoded.user.id;
		req.isAdminUser =false;

		let checkUser = await Users.findOne({_id: req.userId}, {isAdminUser: 1});
		if(checkUser) {
			if(checkUser.isAdminUser)
				req.isAdminUser = checkUser.isAdminUser
		} else {
			return res.status(401).json({ msg: 'User not found' });
		}

		next();
	} catch (err) {
		console.log("Error : ", err);
		return res.status(401).json({ msg: 'Token is not Valid' });
	}
};
