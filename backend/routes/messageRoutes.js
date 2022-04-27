const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
