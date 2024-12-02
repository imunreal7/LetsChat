import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.cookie("jwt", token, {
        httpOnly: true, // prevent XSS attacks
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict", // prevent CSRF
        maxAge: 24 * 60 * 60 * 1000, // in milliseconds
    });
    return token;
};

export default generateToken;
