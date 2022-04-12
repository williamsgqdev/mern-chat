const { registerUser, authUser } = require("../controllers/userControllers");

const router = require("express").Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
