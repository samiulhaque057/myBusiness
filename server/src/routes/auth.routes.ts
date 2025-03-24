import { Router } from "express";
import {
  forgotPassword,
  loggedInUser,
  resetPassword,
  userLogin,
  userLogout,
} from "../controllers/auth.controller";
import { isLoggedIn, isLoggedOut } from "../middlewares/verify";
import validateRequest from "../middlewares/validationRequest";
import {
  forgotPasswordZodSchema,
  loginZodSchema,
  resetPasswordZodSchema,
} from "../middlewares/validation/validation";

const authRouter = Router();

authRouter
  .route("/forgot-password")
  .post(isLoggedOut, validateRequest(forgotPasswordZodSchema), forgotPassword);
authRouter
  .route("/reset-password")
  .post(isLoggedOut, validateRequest(resetPasswordZodSchema), resetPassword);

authRouter
  .route("/login")
  .post(isLoggedOut, validateRequest(loginZodSchema), userLogin);
authRouter.route("/logout").post(isLoggedIn, userLogout);
authRouter.route("/me").get(isLoggedIn, loggedInUser);

// export
export default authRouter;
