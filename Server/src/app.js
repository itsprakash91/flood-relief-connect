import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
const app = express()

// const allowedOrigins = [
//     "http://localhost:8001" // ✅ Add your Netlify frontend URL here
// ];
// Allow Specific Origins
app.use(cors({ 
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'
import helpRequestRouter from "./routes/helpRequest.routes.js"; 
import donationRouter from "./routes/donation.routes.js";
import adminRouter from "./routes/admin.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/help-requests", helpRequestRouter); // Help Request routes
app.use("/api/v1/donations", donationRouter); // Donation routes
app.use("/api/v1/admin", adminRouter); // Admin routes

// url : http://localhost:8000/api/v1/users/register

// Example URL for post routes:
// http://localhost:8000/api/v1/posts/createPost
// http://localhost:8000/api/v1/posts/allPosts
// http://localhost:8000/api/v1/posts/singlePost/:id
// http://localhost:8000/api/v1/posts/updatePost/:id
// http://localhost:8000/api/v1/posts/deletePost/:id
// http://localhost:8000/api/v1/posts/addComment/:id

export {app}