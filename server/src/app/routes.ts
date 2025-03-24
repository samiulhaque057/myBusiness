import productRouter from "../routes/product.routes";
import userRouter from "../routes/user.routes";
import authRouter from "../routes/auth.routes";
import grayRouter from "../routes/gray.routes";
import dyeingRouter from "../routes/dyeing.routes";
import customerRouter from "../routes/customer.routes";
import dailyCashRouter from "../routes/dailyCash.routes";

const routes = [
  {
    path: "/api/v1/products",
    route: productRouter,
  },
  {
    path: "/api/v1/grays",
    route: grayRouter,
  },
  {
    path: "/api/v1/dyeings",
    route: dyeingRouter,
  },

  {
    path: "/api/v1/customers",
    route: customerRouter,
  },
  {
    path: "/api/v1/auth",
    route: authRouter,
  },
  {
    path: "/api/v1/users",
    route: userRouter,
  },
  {
    path: "/api/v1/daily-cash",
    route: dailyCashRouter,
  },
];

// export routes
export default routes;
