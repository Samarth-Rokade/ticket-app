import { Router } from "express";
import {
  Test,
  registerOrganizer,
  loginOrganizer,
  logoutOrganizer,
  refreshAccessToken,
  getCurrentOrganizer,

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


export default router;
