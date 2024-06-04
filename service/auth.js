require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.jwtSecretKey;


function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    },
    jwtSecretKey
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, jwtSecretKey);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};


/*
# Types of authentication
    1. Statefull authentication (use severver memory)
    --> Also called session-based authentication and it is more secure but everytime have to login cannot stay logedin for long time, this auth is used by railway, bank, etc.

    2. Stateless authentication: 
    --> Use jwt package, this method is used by social medias like instagram, facebook, linkedin etc.
    --> Here for this project URL shortener, stateless auth is being used.

    To understand this concept watch video-23 and 24 of Piyush garg's "Master NodeJs" playlist.

# Cookies:    
    --> Cookies are small pieces of text sent to your browser by a website you visit. They help that website remember information about your visit, which can both make it easier to visit the site again and make the site more useful to you.
    
*/