import express from "express";
import {
  addCustomer,
  addCustomerCheck,
  completeCustomerCheckById,
  deleteCustomerById,
  deleteCustomerCheckById,
  deleteCustomerPaymentById,
  getAllCustomerChalan,
  getAllCustomerPayments,
  getAllCustomers,
  getAllCustomersChecks,
  getCustomerById,
  getCustomerChalanById,
  getCustomerPaymentById,
  paymentForCustomerChalan,
  toggleCustomerChalanMarkedById,
  updateCustomerById,
  updateCustomerCheckById,
  updateCustomerPaymentById,
  updatePreviousDueById,
} from "../controllers/customer.controller";
// import { isLoggedIn } from "../middlewares/verify";

const customerRouter = express.Router();

// customerRouter.use(isLoggedIn);

customerRouter.route("/").get(getAllCustomers).post(addCustomer);

customerRouter.route("/").post();

customerRouter.route("/customer-chalan").get(getAllCustomerChalan);
// chalan by id
customerRouter.route("/customer-chalan/:id").get(getCustomerChalanById);

customerRouter.route("/all-customers-payments").get(getAllCustomerPayments);
customerRouter.route("/customer-payment").post(paymentForCustomerChalan);

// previous due
customerRouter.route("/update-previous-due/:id").patch(updatePreviousDueById);

// check
customerRouter
  .route("/checks")
  .get(getAllCustomersChecks)
  .post(addCustomerCheck);

customerRouter
  .route("/checks/:id")
  .patch(updateCustomerCheckById)
  .delete(deleteCustomerCheckById);

// complete check
customerRouter.route("/check-complete/:id").patch(completeCustomerCheckById);

customerRouter
  .route("/customer-payment/:id")
  .get(getCustomerPaymentById)
  .put(updateCustomerPaymentById)
  .delete(deleteCustomerPaymentById);
customerRouter
  .route("/toggle-marked/:id")
  .patch(toggleCustomerChalanMarkedById);

customerRouter
  .route("/:id")
  .delete(deleteCustomerById)
  .put(updateCustomerById)
  .get(getCustomerById);

export default customerRouter;
