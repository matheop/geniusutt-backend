require("dotenv").config();
const User = require("../models/user");
const { Roles } = require("../utils/enums");
const { errorHandler } = require("../utils/error");

module.exports = async (req, res, next) => {
	const id = req.userId;

	try {
		const user = await User.findById(id);

		if (!user) throw errorHandler("No user found.", 404);
		else if (user.role !== Roles.ADMIN) {
			throw errorHandler("Not allowed", 405);
		}
	} catch (err) {
		throw err;
	}

	next();
};
