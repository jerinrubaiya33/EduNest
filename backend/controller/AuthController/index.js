const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// @desc   Register new user
// @route  POST /api/auth/signup
// @access Public
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });

    } catch (err) {
        next(err); // Pass to global error handler
    }
};

// @desc   Login user
// @route  POST /api/auth/signin
// @access Public
const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            // { expiresIn: "2d" }
        );

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};
module.exports = { signup, signin };