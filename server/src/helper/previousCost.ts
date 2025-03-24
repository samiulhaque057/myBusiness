import axios from "axios";
import { serverURL } from "../app/secret";

export const previousCashCalculate = async (
  previousDate: string,
  previousCash: any = {}
) => {
  const {
    data: { data: graysPayments },
  } = await axios.get(
    `${serverURL}/api/v1/grays/all-gray-payments?date[eq]=${previousDate}`
  );

  const {
    data: { data: dyeingsPayments },
  } = await axios.get(
    `${serverURL}/api/v1/dyeings/all-dyeing-payments?date[eq]=${previousDate}`
  );

  const {
    data: { data: customersPayments },
  } = await axios.get(
    `${serverURL}/api/v1/customers/all-customers-payments?date[eq]=${previousDate}`
  );

  const todaySold = customersPayments?.reduce((acc: number, payment: any) => {
    return acc + payment?.amount;
  }, 0);

  const totalGraysPayment =
    graysPayments?.reduce((sum: number, payment: any) => {
      return sum + (payment?.amount || 0);
    }, 0) || 0;
  const totalDyeingsPayment =
    dyeingsPayments?.reduce((sum: number, payment: any) => {
      return sum + (payment?.amount || 0);
    }, 0) || 0;

  const othersCost =
    previousCash?.othersCost?.reduce((sum: number, cost: any) => {
      return sum + (cost?.amount || 0);
    }, 0) || 0;

  const totalCashIn =
    previousCash?.cashIn?.reduce((sum: number, cash: any) => {
      return sum + (cash?.amount || 0);
    }, 0) || 0;

  const totalCost = totalDyeingsPayment + totalGraysPayment + othersCost;

  const todayCash =
    todaySold + previousCash?.previous + totalCashIn - totalCost;

  return todayCash;
};
