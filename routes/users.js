const express = require("express");

const usersController = require("../controllers/users");
const { userValidator } = require("../utils/dataValidator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// TODO: add "isAuth"

// GET ALL
router.get("/getAll", usersController.getAll);

// GET ONE
router.get("/getOne/:userId", usersController.getOneById);

// CREATE
router.post("/create", userValidator, usersController.create);

// UPDATE
router.put("/update/:userId", userValidator, usersController.update);

// DELETE
router.delete("/delete/:userId", usersController.delete);

module.exports = router;
