const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                return value.match(re);
            },
            message: "Please enter a valid email",
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return value.length > 6;
            },
            message: "Please enter at least 6 character long password",
        }
    },
},
    {timestamps: true}
);

const User = mongoose.model("user", userSchema);

module.exports = User;