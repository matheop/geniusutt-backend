const jwt = require("jsonwebtoken");
require("dotenv").config();
const { error500, errorHandler } = require("../utils/error");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) throw errorHandler("Not authenticated", 401);

	const token = authHeader.split(" ")[1];
	console.log("token:", token);
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log("decodedToken:", decodedToken);
	} catch (error) {
		throw error500(error);
	}

	if (!decodedToken) throw errorHandler("Not authenticated", 401);

	req.userId = decodedToken.user._id;
	next();
};
