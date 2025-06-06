const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/auth");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();



router.get("/check-auth", checkAuth, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);

router.post("/logout", (req, res) => {
    res.clearCookie("uid");
    return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;

