import jwt from "jsonwebtoken";

/*
==========================================
GENERAL AUTHENTICATION
SUPPORTS:
1. Authorization Bearer Token
2. Technician Cookie
3. Admin Cookie
4. Client Cookie
==========================================
*/

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token = null;

  // Authorization Header
  if (authHeader) {
    token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  }

  // Cookie Authentication
  if (!token) {
    token =
      req.cookies?.technician_token ||
      req.cookies?.admin_token ||
      req.cookies?.client_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
};


/*
==========================================
ADMIN AUTHENTICATION
COOKIE: admin_token
==========================================
*/

export const verifyAdminToken = (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Admin not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Admin access required",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired admin token",
    });
  }
};


/*
==========================================
TECHNICIAN AUTHENTICATION
COOKIE: technician_token
==========================================
*/

export const verifyTechnicianToken = (req, res, next) => {
  const token = req.cookies?.technician_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Technician not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "technician") {
      return res.status(403).json({
        success: false,
        msg: "Technician access required",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired technician token",
    });
  }
};


/*
==========================================
CLIENT AUTHENTICATION
COOKIE: client_token
==========================================
*/

export const verifyClientToken = (req, res, next) => {
  const token = req.cookies?.client_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Client not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        msg: "Client access required",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired client token",
    });
  }
};


/*
==========================================
ADMIN ONLY
==========================================
*/

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};