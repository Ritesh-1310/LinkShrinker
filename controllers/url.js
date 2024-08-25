const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'URL is required' });

    const shortID = shortid();

    // Create a new shortened URL entry
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    // Fetch the user's URL history
    const urls = await URL.find({ createdBy: req.user._id });

    // Render the home page with both the shortened URL and the URL history
    return res.render("home", { 
        id: shortID,
        urls,  // Pass the URL history to the template
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function handleDeleteURL(req, res) {
    const { shortId } = req.params;
    const userId = req.user._id;

    const url = await URL.findOneAndDelete({ shortId, createdBy: userId });

    if (!url) {
        return res.status(404).json({ error: "URL not found or you don't have permission to delete this URL" });
    }

    return res.redirect("/");
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL,
};