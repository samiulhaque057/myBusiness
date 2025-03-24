import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/users.controllers ";
import validateRequest from "../middlewares/validationRequest";
import { createUserZodSchema } from "../middlewares/validation/validation";
// import { isLoggedIn } from "../middlewares/verify";

const userRouter = Router();

// userRouter.use(isLoggedIn);

userRouter
  .route("/")
  .get(getAllUsers)
  .post(validateRequest(createUserZodSchema), createUser);

userRouter
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

// export user router
export default userRouter;
