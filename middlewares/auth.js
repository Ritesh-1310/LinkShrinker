const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.status(401).json({ error: "Unauthorized: No session UID found" });
    }

    const user = getUser(userUid);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized: Invalid session" });
    }

    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = getUser(userUid);

    req.user = user || null;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};

