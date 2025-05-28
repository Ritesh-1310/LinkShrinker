// const shortid = require("shortid");
// const URL = require('../models/url');

// async function handleGenerateNewShortURL(req, res) {
//     const body = req.body;
//     if (!body.url) return res.status(400).json({ error: 'URL is required' });

//     // Check if the URL is 46 characters or fewer
//     if (body.url.length <= 46) {
//         return res.render("home", { 
//             id: null, 
//             smallLinkMessage: "Link is already quite small"
//         });
//     }

//     const shortID = shortid();

//     await URL.create({
//         shortId: shortID,
//         redirectURL: body.url,
//         visitedHistory: [],
//         createdBy: req.user._id,
//     });

//     const urls = await URL.find({ createdBy: req.user._id }); // Fetch all URLs for this user

//     return res.render("home", { 
//         id: shortID,
//         urls: urls, // Pass the URLs to the frontend to display the history
//     });
// }

// async function handleGetAnalytics(req, res) {
//     const shortId = req.params.shortId;
//     const result = await URL.findOne({ shortId });
//     return res.json({
//         totalClicks: result.visitHistory.length,
//         analytics: result.visitHistory,
//     });
// }

// async function handleDeleteURL(req, res) {
//     const { shortId } = req.params;
//     const userId = req.user._id;

//     const url = await URL.findOneAndDelete({ shortId, createdBy: userId });

//     if (!url) {
//         return res.status(404).json({ error: "URL not found or you don't have permission to delete this URL" });
//     }

//     return res.redirect("/");
// }

// module.exports = {
//     handleGenerateNewShortURL,
//     handleGetAnalytics,
//     handleDeleteURL,
// };


//-----Implemented Try-Catch for error handling which prevent from server crashing-------
const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: 'URL is required' });

        // Check if the URL is 46 characters or fewer
        if (body.url.length <= 46) {
            return res.render("home", { 
                id: null, 
                smallLinkMessage: "Link is already quite small"
            });
        }

        const shortID = shortid();

        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitedHistory: [],
            createdBy: req.user._id,
        });

        const urls = await URL.find({ createdBy: req.user._id }); // Fetch all URLs for this user

        return res.render("home", { 
            id: shortID,
            urls: urls, // Pass the URLs to the frontend to display the history
        });
    } catch (error) {
        console.error("Error generating new short URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleDeleteURL(req, res) {
    try {
        const { shortId } = req.params;
        const userId = req.user._id;

        const url = await URL.findOneAndDelete({ shortId, createdBy: userId });

        if (!url) {
            return res.status(404).json({ error: "URL not found or you don't have permission to delete this URL" });
        }

        return res.redirect("/");
    } catch (error) {
        console.error("Error deleting URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL,
};

