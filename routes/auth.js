const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

const {
	signupValidator,
	loginValidator,
} = require("../utils/dataValidator");

router.put("/signup", signupValidator, authController.signup);

router.post("/login", loginValidator, authController.login);

module.exports = router;
