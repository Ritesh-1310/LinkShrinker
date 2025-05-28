// const express = require("express");
// const URL = require("../models/url");

// const router = express.Router();

// /// Home route
// router.get("/", async (req, res) => {
//     if (!req.user) return res.redirect("/login");
//     const allurls = await URL.find({ createdBy: req.user._id });
//     return res.render("home", {
//         urls: allurls,
//     });
// });

// /// Create new URL route
// router.get("/signup", (req, res) => {
//     return res.render("signup");
// });

// /// Signup route
// router.get("/login", (req, res) => {
//     return res.render("login");
// });

// /// Logout route
// router.post("/logout", (req, res) => {
//   res.clearCookie("uid"); // or your session/token cookie
//   // req.session.destroy(); // if using sessions
//   return res.redirect("/login");
// });


// module.exports = router;
//----------------------------------------------------------------------
// routes/staticRouter.js
const express = require("express");
const URL = require("../models/url");
const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" }); // modified
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.status(200).json({ urls: allurls }); // modified
});

router.get("/signup", (req, res) => {
    return res.status(200).json({ message: "Signup page" }); // modified (placeholder)
});

router.get("/login", (req, res) => {
    return res.status(200).json({ message: "Login page" }); // modified (placeholder)
});

router.post("/logout", (req, res) => {
    res.clearCookie("uid");
    return res.status(200).json({ message: "Logged out successfully" }); // modified
});

module.exports = router;

