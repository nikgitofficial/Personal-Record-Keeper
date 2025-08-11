  import jwt from "jsonwebtoken";

  
const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;            
    req.userId = decoded.id;         
    next();
  } catch (err) {
    // Use 401 or 403 instead of 400
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

  export default verifyToken;



