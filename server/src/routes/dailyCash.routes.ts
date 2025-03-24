import { Router } from "express";
import {
  addBalance,
  addOthersCost,
  createDailyCash,
  deleteDailyCashById,
  getAllDailyCash,
  getDailyCashByDate,
} from "../controllers/dailyCash";
// import { isLoggedIn } from "../middlewares/verify";

const dailyCashRouter = Router();
// dailyCashRouter.use(isLoggedIn);

dailyCashRouter.route("/").get(getAllDailyCash).post(createDailyCash);

dailyCashRouter.route("/add-balance").patch(addBalance);

dailyCashRouter.route("/others-cost").post(addOthersCost);
dailyCashRouter.route("/:date").get(getDailyCashByDate);
dailyCashRouter.route("/:id").delete(deleteDailyCashById);
// dailyCashRouter.route("/:id").get(getDailyCashById).delete(deleteDailyCashById);

export default dailyCashRouter;
