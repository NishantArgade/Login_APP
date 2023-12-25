import { Router } from "express";
const router = Router();

/** Import all controllers */
import * as controller from "../controller/appController.js";
import { send } from "../controller/sendMail.js";
import auth, { localVariables } from "../middleware/auth.js";
import verifyUser from "../middleware/verifyUser.js";

/** POST Methods */
router.route("/register").post(controller.register);
router.route("/registerMail").post(send);
router.route("/authenticate").post(verifyUser, (req, res) => {
  res.status(200).send({ msg: "authenticated" });
});
router.route("/login").post(controller.login);

/** GET Methods */
router.route("/user/:username").get(controller.getUser);
router
  .route("/generateOTP")
  .get(verifyUser, localVariables, controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.creteResetSession);

/** PUT Methods */
router.route("/updateuser").put(auth, controller.updateUser);
router.route("/resetpassword").put(verifyUser, controller.resetPassword);

export default router;
