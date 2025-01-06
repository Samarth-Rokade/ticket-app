import { Router } from "express";
import {
  Test,
  registerOrganizer,
  loginOrganizer,
  logoutOrganizer,
  refreshAccessToken,
  getCurrentOrganizer,
  updateAccountDetails,
  changePassword,
} from "../controllers/organizer.controller.js";
import { verifyJWT } from "../middlewares/organizerAuth.middleware.js";

const router = Router();

router.route("/Usertesting").post(Test);

router
  .route("/register")
  .post(registerOrganizer);

router.route("/login").post(loginOrganizer);

//secured routes
router.get("/logout", verifyJWT, logoutOrganizer);
router.post("/refresh-token", refreshAccessToken);

router.get("/get-current-user", verifyJWT, getCurrentOrganizer);
router.post("/update-account-details", verifyJWT, updateAccountDetails);
router.post("/change-password", verifyJWT, changePassword);


export default router;
