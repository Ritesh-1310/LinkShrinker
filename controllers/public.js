const shortid = require("shortid");
const URL = require("../models/url");

async function handlePublicURLShorten(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (url.length <= 46) {
      return res.status(400).json({ error: "Link is already quite short" });
    }

    const shortId = shortid();

    await URL.create({
      shortId,
      redirectURL: url,
      visitedHistory: [],
      createdBy: null, // 🔸 anonymous
    });

    return res.status(200).json({
      message: "Shortened successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/api/url/${shortId}`,
    });
  } catch (err) {
    console.error("Error shortening public URL:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handlePublicURLShorten,
};
