import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hashedPassword, name });
        if (user) {
            const token = generateToken(user._id, res);
            return res.status(201).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                profilePic: user.profilePic,
                token,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id, res);
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Error in login: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const user = await User.findById(req.user._id);
        if (user) {
            const uploadedPic = await cloudinary.uploader.upload(profilePic, {
                folder: "profilePics",
            });
            user.profilePic = uploadedPic.secure_url;
            await user.save();
            return res.status(200).json({ message: "Profile picture updated successfully" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log("Error in updateProfilePic: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { signup, login, logout, updateProfilePic, checkAuth };
