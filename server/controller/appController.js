import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpgenerator from "otp-generator";
import UserModel from "../model/User.model.js";

/** POST: http://localhost:8080/api/register */
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existUsername = new Promise(async (resolve, reject) => {
      try {
        await UserModel.findOne({ username });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // check for existing email
    const existEmail = new Promise(async (resolve, reject) => {
      try {
        await UserModel.findOne({ email });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password.toString(), 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });

              // return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** POST: http://localhost:8080/api/login */
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    UserModel.findOne({ username })
      .then((user) => {
        bcrypt.compare(password, user.password).then((check) => {
          if (!check)
            return res.status(400).json({ error: "Invalid Credential" });

          const access_token = jwt.sign(
            { userid: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "login success",
            access_token,
            username: user.username,
          });
        });
      })
      .catch((err) => {
        return res.status(404).json({ error: "User Not Found" });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** GET: http://localhost:8080/api/user/example@121 */
export async function getUser(req, res) {
  try {
    const { username } = req.params;
    if (!username) return res.status(401).json({ error: "Invalid Username" });

    const user = await UserModel.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/** PUT: http://localhost:8080/api/updateUser*/
export async function updateUser(req, res) {
  try {
    const { userid: id } = req.user;
    if (!id) return res.status(404).json({ error: "User not found" });

    const body = req.body;
    await UserModel.updateOne({ _id: id }, { $set: body });
    return res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/** GET http://localhost:8080/api/generateOTP*/
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpgenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).json({ code: req.app.locals.OTP });
}

/** GET http://localhost:8080/api/verifyOTP*/
export async function verifyOTP(req, res) {
  const { code, username } = req.query;

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = false;
    req.app.locals.resetSession = true;
    return res.status(200).json({ msg: "OTP verified successfully" });
  }

  res.status(400).json({ msg: "Invalid OTP" });
}

/** GET http://localhost:8080/api/creteResetSession*/
export async function creteResetSession(req, res) {
  if (req.app.locals.resetSession) {
    // req.app.locals.resetSession = false;
    return res.status(200).json({ flag: req.app.locals.resetSession });
  }
  return res.status(440).json({ msg: "session has expired" });
}
/** GET http://localhost:8080/api/resetPassword*/
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).json({ msg: "session has expired" });

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) return res.status(404).json({ error: "user not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false;

    res.status(200).json({ msg: "reset password successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
