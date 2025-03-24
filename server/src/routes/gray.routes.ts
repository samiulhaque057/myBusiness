import express from "express";
import {
  createGray,
  deleteGrayById,
  deleteGrayChalanById,
  deleteGrayPaymentById,
  getAllGrayPayment,
  getAllGrays,
  getGrayById,
  grayPayment,
  toggleGrayChalanMarkedById,
  updateGrayById,
  updateGrayPaymentById,
} from "../controllers/gray.controller";
import validateRequest from "../middlewares/validationRequest";
import { createGrayZodSchema } from "../middlewares/validation/validation";
// import { isLoggedIn } from "../middlewares/verify";

const grayRouter = express.Router();

// grayRouter.use(isLoggedIn);

grayRouter
  .route("/")
  .get(getAllGrays)
  .post(validateRequest(createGrayZodSchema), createGray);

// gray payment
grayRouter.route("/gray-payment").post(grayPayment);
grayRouter.route("/all-gray-payments").get(getAllGrayPayment);
grayRouter.route("/gray-payment/:id").patch(updateGrayPaymentById);
grayRouter.route("/gray-payment/:id").delete(deleteGrayPaymentById);

grayRouter.route("/toggle-marked/:id").patch(toggleGrayChalanMarkedById);

// delete gray chalam
grayRouter.route("/gray-chalan/:id").delete(deleteGrayChalanById);

grayRouter
  .route("/:id")
  .get(getGrayById)
  .put(updateGrayById)
  .delete(deleteGrayById);

// export gray router
export default grayRouter;
