// routes/public.js

const express = require("express");
const { handlePublicURLShorten } = require("../controllers/public");

const router = express.Router();

// 🔹 Public shortening route
router.post("/", handlePublicURLShorten);

module.exports = router;
