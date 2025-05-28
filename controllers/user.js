// const {v4: uuidv4} = require('uuid');         
// const User = require("../models/user"); 
// const { setUser } = require("../service/auth");  
                                               
// async function handleUserSignup(req, res) {
//     const { name, email, password } = req.body;
//     await User.create({
//         name,
//         email,
//         password, 
//     });
//     return res.redirect("/");
// }       

// async function handleUserLogin(req, res) {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });

//     if(!user)
//         return res.render("login", {
//             error: "Invalid Username or Password",
//     });

//     const token = setUser(user);
//     res.cookie("uid", token);
//     return res.redirect("/");
// }

// module.exports = {
//     handleUserSignup, 
//     handleUserLogin,
// }

//-----Implemented Try-Catch for error handling which prevent from server crashing---------
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("signup", {
                error: "Email already in use",
            });
        }

        await User.create({
            name,
            email,
            password,
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).render("signup", {
            error: "An error occurred during signup. Please try again later.",
        });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).render("login", {
                error: "Invalid Username or Password",
            });
        }

        const token = setUser(user);
        res.cookie("uid", token);
        return res.redirect("/");
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).render("login", {
            error: "An error occurred during login. Please try again later.",
        });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}
