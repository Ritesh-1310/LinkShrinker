const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        await User.create({ name, email, password });
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).json({ error: "Signup failed" }); 
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" }); 
        }

        const token = setUser(user);
        res.cookie(
            "uid", 
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: "None", // important!
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            }
        );
        return res.status(200).json({ token, message: "Login successful" }); 
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ error: "Login failed" }); 
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
