import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}
// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required including role"
            });
        }

        // Validate role
        const validRoles = ["victim", "volunteer", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be one of: victim, volunteer, admin"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,  // will be hashed by pre-save hook
            role
        });

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        // Set tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("register error:", error);
        return res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
}

// Login user
const login = async (req, res) => {
    try {
        console.log("---- LOGIN HIT ----");
        console.log("Req body:", req.body);

        const { email, password } = req.body;
        console.log("Email from body:", `"${email}"`);
        console.log("Password from body:", `"${password}"`);

        const user = await User.findOne({ email }).select("+password");
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        // Set tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
}

// Logout user
const logout = async (req, res) => {
    try {
        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message
        });
    }
}

// Get current user (requires auth middleware)
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("getCurrentUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
}

// Update user profile (requires auth)
const updateProfile = async (req, res) => {
    try {
        // Only allow certain fields to be updated
        const allowedUpdates = ["name", "location"];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("updateProfile error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
}

export { register, login, logout, getCurrentUser, updateProfile }