import jwt from "jsonwebtoken";
import ENV from "../config.js";
// import UserModel from "../model/User.model.js";

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new Error("Invalid authorization"));

    const verifyUser = jwt.verify(token, ENV.JWT_SECRET);
    if (!verifyUser) return next(new Error("Invalide authorization"));

    req.user = verifyUser;

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};
export default auth;
