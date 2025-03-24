import express from "express";
import validateRequest from "../middlewares/validationRequest";
import {
  createDyeing,
  deleteDyeingById,
  deleteDyeingPaymentById,
  dyeingPayment,
  getAllDyeingPayment,
  getAllDyeings,
  getDyeingById,
  toggleDyeingChalanMarkedById,
  updateDyeingById,
  updateDyeingChalanProducts,
  updateDyeingPaymentById,
} from "../controllers/dyeing.controller";
import { createDyeingZodSchema } from "../middlewares/validation/validation";
// import { isLoggedIn } from "../middlewares/verify";

const dyeingRouter = express.Router();

// dyeingRouter.use(isLoggedIn);

dyeingRouter
  .route("/")
  .get(getAllDyeings)
  .post(validateRequest(createDyeingZodSchema), createDyeing);

// update dyeing chalans products
dyeingRouter
  .route("/updateDyeingChalanProducts")
  .patch(updateDyeingChalanProducts);

// dyeing payment
dyeingRouter.route("/dyeing-payment").post(dyeingPayment);
dyeingRouter.route("/all-dyeing-payments").get(getAllDyeingPayment);
dyeingRouter.route("/dyeing-payment/:id").patch(updateDyeingPaymentById);
dyeingRouter.route("/dyeing-payment/:id").delete(deleteDyeingPaymentById);

dyeingRouter.route("/toggle-marked/:id").patch(toggleDyeingChalanMarkedById);

dyeingRouter
  .route("/:id")
  .get(getDyeingById)
  .put(updateDyeingById)
  .delete(deleteDyeingById);

// export dyeing router
export default dyeingRouter;
