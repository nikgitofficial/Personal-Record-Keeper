export default function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized: no user found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden: admin access only" });
  }

  next();
}
