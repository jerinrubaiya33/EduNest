const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"], // allowed roles
        default: "student", // normal user by default
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);