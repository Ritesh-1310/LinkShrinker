const express = require("express");

const {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL
} = require("../controllers/url");

const URL = require("../models/url");
const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" }); 
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.status(200).json({ urls: allurls }); 
});


router.post("/", handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);
router.delete('/delete/:shortId', handleDeleteURL);

module.exports = router;
