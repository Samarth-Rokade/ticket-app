import { Router } from "express";
import {
  Test,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  updateAccountDetails,

} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";

const router = Router();

router.route("/Usertesting").post(Test);

router
  .route("/register")
  .post(registerUser);

router.route("/login").post(loginUser);
router.post("/change-password",verifyJWT,changePassword);
router.post("/update-account-details",verifyJWT,updateAccountDetails);

//secured routes
router.get("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.get("/get-current-user", verifyJWT, getCurrentUser);


export default router;
