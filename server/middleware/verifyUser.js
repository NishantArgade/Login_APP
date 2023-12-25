import UserModel from "../model/User.model.js";

const verifyUser = async (req, res, next) => {
  try {
    let { username } = req.method === "GET" ? req.query : req.body;
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found!" });

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default verifyUser;
