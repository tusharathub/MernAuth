import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(400).json({message: "Invalid token, you are unauthorized"});

        req.userId = decoded.userId;
    } catch (error) {
        console.log("Error in verifying token", error);
        return res.status(500).json({success: false, message: "server error"});
    }
} 