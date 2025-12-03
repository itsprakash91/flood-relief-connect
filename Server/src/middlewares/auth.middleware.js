import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if(!user) {
            // NEXT_VIDEO : discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})


// Optional auth - allows both authenticated and anonymous users
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(); // Continue without user
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        
        if (user) {
            req.user = user;
        }
        
        next();

    } catch (error) {
        // Continue without user on any error
        next();
    }
}

// Role-based authorization middlewares
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to perform this action"
            });
        }

        next();
    }
}

// Specific role checks (for convenience)
const isAdmin = authorizeRoles("admin");
const isVolunteer = authorizeRoles("volunteer", "admin");

// Example usage in routes:
/*
router.post("/help-requests", verifyJWT, createHelpRequest);
router.get("/admin/dashboard", verifyJWT, isAdmin, getDashboardStats);
router.post("/volunteer/accept-request", verifyJWT, isVolunteer, acceptHelpRequest);
*/


export {
    verifyJWT,
    optionalAuth,
    authorizeRoles,
    isAdmin,
    isVolunteer
}