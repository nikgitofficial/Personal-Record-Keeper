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
      res.status(400).json({ msg: "Invalid token" });
    }
  };

  export default verifyToken;



