import jwt from 'jsonwebtoken';

// Protect future admin endpoints by validating the bearer token on every request.
const protectAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({ success: false, message: 'Admin authorization is required.' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Admin session is invalid or expired.' });
  }
};

export default protectAdmin;