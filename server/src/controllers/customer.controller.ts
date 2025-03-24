import { prismaClient } from "./../helper/prisma";
import asyncHandler from "express-async-handler";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";
import createError from "http-errors";
import { formatISO } from "date-fns";

interface DateQuery {
  gte?: string;
  lte?: string;
  eq?: string;
}

/**
 *
 * @description        Get All Cutomers
 * @method             GET
 *
 * @route              /api/v1/customers
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;
    const customers = await prismaClient.customer.findMany({
      include: {
        products: {
          include: {
            finishedProducts: true,
          },
        },
        chalans: {
          include: {
            customer: true,
            customerProducts: {
              include: {
                finishedProducts: true,
                product: true,
              },
            },
          },
          where: {
            date: dateQuery
              ? {
                  gte: dateQuery?.gte ? dateQuery.gte : undefined,
                  lte: dateQuery.lte ? dateQuery.lte : undefined,
                  equals: dateQuery.eq ? dateQuery.eq : undefined,
                }
              : undefined,
          },
        },
        customerPayments: true,
      },
    });

    if (!customers.length) throw createError.NotFound("No customers found");

    successResponse(res, {
      statusCode: 200,
      message: "All customers",
      payload: {
        data: customers,
      },
    });
  }
);

/**
 *
 * @description        Get Customer by id
 * @method             GET
 *
 * @route              /api/v1/customers/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const getCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;

    const customer = await prismaClient.customer.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        products: {
          include: {
            finishedProducts: true,
          },
        },
        chalans: {
          include: {
            customerProducts: {
              include: {
                finishedProducts: true,
                product: true,
              },
            },
            payments: true,
          },
          where: {
            date: dateQuery
              ? {
                  gte: dateQuery?.gte ? dateQuery.gte : undefined,
                  lte: dateQuery.lte ? dateQuery.lte : undefined,
                  equals: dateQuery.eq ? dateQuery.eq : undefined,
                }
              : undefined,
          },
          orderBy: {
            date: "desc",
          },
        },
        customerPayments: true,
      },
    });

    if (!customer) throw createError.NotFound("Customer not found");

    successResponse(res, {
      statusCode: 200,
      message: "Customer data",
      payload: {
        data: customer,
      },
    });
  }
);

/**
 *
 * @description        Add New Customer
 * @method             POST
 *
 * @route              /api/v1/customers
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const addCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, address } = req.body;

  if (!name || !phone || !address) {
    throw createError.BadRequest("Please provide all the required fields");
  }

  const exist = await prismaClient.customer.findUnique({
    where: {
      phone: req.body.phone,
    },
  });

  if (exist) throw createError.Conflict("Phone number already exist.");

  const customer = await prismaClient.customer.create({
    data: {
      name,
      phone,
      address,
    },
  });

  successResponse(res, {
    statusCode: 201,
    message: "Customer added successfully",
    payload: {
      data: customer,
    },
  });
});

/**
 *
 * @description        Delete Customer by id
 * @method             DELETE
 *
 * @route              /api/v1/customers/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const deleteCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = await prismaClient.customer.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!customer) throw createError.NotFound("Customer not found");

    await prismaClient.customer.delete({
      where: {
        id: +req.params.id,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Customer data deleted successfully.",
      payload: {
        data: customer,
      },
    });
  }
);

/**
 *
 * @description        Update Customer by id
 * @method             PATCH
 *
 * @route              /api/v1/customers/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const updateCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await prismaClient.customer.findUnique({
      where: { id: +id },
    });

    if (!customer) throw createError.NotFound("Customer not found!");

    const updatedCustomer = await prismaClient.customer.update({
      where: { id: +id },
      data: req.body,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Customer updated successfully",
      payload: {
        data: updatedCustomer,
      },
    });
  }
);

/**
 *
 * @description        Get All Cutomers Payments
 * @method             GET
 *
 * @route              /api/v1/customers/all-customers-payments
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const getAllCustomerPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;

    const payments = await prismaClient.customerPayment.findMany({
      include: {
        customer: true,
        CustomerChalan: true,
      },
      where: {
        date: dateQuery
          ? {
              gte: dateQuery?.gte ? dateQuery.gte : undefined,
              lte: dateQuery.lte ? dateQuery.lte : undefined,
              equals: dateQuery.eq ? dateQuery.eq : undefined,
            }
          : undefined,
      },
    });

    // if (!payments?.length)
    //   throw createError.NotFound("Couldn't find any customer payments");

    successResponse(res, {
      statusCode: 200,
      message: "All customers payments data",
      payload: {
        data: payments?.length ? payments : [],
      },
    });
  }
);

/**
 *
 * @description        Payment for Customer chalan
 * @method             POST
 *
 * @route              /api/v1/customers/customer-payment
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const paymentForCustomerChalan = asyncHandler(
  async (req: Request, res: Response) => {
    const { customerChalanId, customerId, amount, date, isPreviousPayment } =
      req.body;

    // create payment
    const payment = await prismaClient.customerPayment.create({
      data: {
        customerId: +customerId,
        amount: +amount,
        date: date.split("T")[0],
        customerChalanId: customerChalanId ? +customerChalanId : null,
        isPreviousPayment: isPreviousPayment || false,
      },
    });

    successResponse(res, {
      statusCode: 201,
      message: "Payment done successfully",
      payload: {
        data: payment,
      },
    });
  }
);

/**
 *
 * @description        Get Customer Payment by id
 * @method             GET
 *
 * @route              /api/v1/customers/customer-payment/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const getCustomerPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.id) throw createError.NotFound("Id is required!");

    const payment = await prismaClient.customerPayment.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!payment)
      throw createError.NotFound("Couldn't find any customer payment.");

    successResponse(res, {
      statusCode: 200,
      message: "Customer payment data.",
      payload: {
        data: payment,
      },
    });
  }
);

/**
 *
 * @description        Update Customer Payment by id
 * @method             PUT
 *
 * @route              /api/v1/customers/customer-payment/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const updateCustomerPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.body);

    const payment = await prismaClient.customerPayment.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!payment) createError.NotFound("Customer payment data not found.");

    const updatedData = await prismaClient.customerPayment.update({
      where: { id: +req.params.id },
      data: {
        amount: req.body.amount,
        date: req.body.date.split("T")[0],
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Customer payment updated successfully.",
      payload: {
        data: updatedData,
      },
    });
  }
);

/**
 *
 * @description        Delete Customer Payment by id
 * @method             DELETE
 *
 * @route              /api/v1/customers/customer-payment/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const deleteCustomerPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await prismaClient.customerPayment.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (payment) createError.NotFound("Customer payment data not found.");

    await prismaClient.customerPayment.delete({
      where: {
        id: +req.params.id,
      },
    });
    successResponse(res, {
      statusCode: 200,
      message: "Customer payment deleted succefully.",
      payload: {
        data: payment,
      },
    });
  }
);

/**
 *
 * @description        Toggle Customer Chalan payment marked by id
 * @method             PATCH
 *
 * @route              /api/v1/customers/toggle-marked/:id
 * @access             Private
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   Customer data not found.
 *
 */
export const toggleCustomerChalanMarkedById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const chalan = await prismaClient.customerChalan.findUnique({
      where: { id: +id },
    });

    if (!chalan) throw createError.NotFound("Chalan not found!");

    const updatedChalan = await prismaClient.customerChalan.update({
      where: { id: +id },
      data: {
        markedPaid: req.body.markedPaid,
        discount: req.body.discount,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Change marked.",
      payload: {
        data: updatedChalan,
      },
    });
  }
);

// get all customer chalan by id
export const getAllCustomerChalan = asyncHandler(
  async (_req: Request, res: Response) => {
    const chalans = await prismaClient.customerChalan.findMany();

    if (!chalans?.length)
      throw createError.NotFound("Couldn't find any customer chalan.");

    successResponse(res, {
      statusCode: 200,
      message: "All customer chalans",
      payload: {
        data: chalans,
      },
    });
  }
);

// get customer chalan by id
export const getCustomerChalanById = asyncHandler(
  async (req: Request, res: Response) => {
    const chalan = await prismaClient.customerChalan.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        customerProducts: {
          include: {
            finishedProducts: true,
            product: true,
          },
        },
        payments: true,
        customer: true,
        products: true,
      },
    });

    if (!chalan) throw createError.NotFound("Customer chalan not found!");

    successResponse(res, {
      statusCode: 200,
      message: "Customer chalan data.",
      payload: {
        data: chalan,
      },
    });
  }
);

// add customer check
export const addCustomerCheck = asyncHandler(
  async (req: Request, res: Response) => {
    const check = await prismaClient.customerCheck.create({
      data: {
        amount: +req.body.amount,
        bank: req.body.bank,
        date: formatISO(new Date(req?.body?.date)).split("T")[0],
        customerId: +req.body.customerId,
        status: false,
      },
    });

    successResponse(res, {
      statusCode: 201,
      message: "Successfully check added.",
      payload: {
        data: check,
      },
    });
  }
);

// update customer check
export const updateCustomerCheckById = asyncHandler(
  async (req: Request, res: Response) => {
    const check = await prismaClient.customerCheck.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        amount: +req.body.amount,
        date: formatISO(new Date(req?.body?.date)).split("T")[0],
      },
    });

    if (!check) throw createError.NotFound("Couldn't find any customer check.");

    successResponse(res, {
      statusCode: 200,
      message: "Successfully update.",
      payload: {
        data: check,
      },
    });
  }
);

// get All customers check
export const getAllCustomersChecks = asyncHandler(
  async (_req: Request, res: Response) => {
    const checks = await prismaClient.customerCheck.findMany({
      include: {
        customer: true,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "All Checks data",
      payload: {
        data: checks?.length ? checks : [],
      },
    });
  }
);

// delete customer check by id
export const deleteCustomerCheckById = asyncHandler(
  async (req: Request, res: Response) => {
    const check = await prismaClient.customerCheck.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!check) throw createError.NotFound("Couldn't find any customer check");

    await prismaClient.customerCheck.delete({
      where: { id: +req.params.id },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Successfully deleted.",
      payload: {
        data: check,
      },
    });
  }
);

// complete customer check by id
export const completeCustomerCheckById = asyncHandler(
  async (req: Request, res: Response) => {
    const check = await prismaClient.customerCheck.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!check) throw createError.NotFound("Couldn't find customer check.");

    // payment added
    const payment = await prismaClient.customerPayment.create({
      data: {
        date: formatISO(new Date()).split("T")[0],
        customerId: req.body.customerId,
        amount: req.body.amount,
      },
    });

    // check update
    await prismaClient.customerCheck.update({
      where: {
        id: +req.params?.id,
      },
      data: {
        status: true,
      },
    });

    // response
    successResponse(res, {
      statusCode: 200,
      message: "Successfully payment done",
      payload: {
        data: payment,
      },
    });
  }
);

// update previous due by id
export const updatePreviousDueById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await prismaClient.customer.findUnique({
      where: { id: +id },
    });

    if (!customer) throw createError.NotFound("Customer not found!");

    const updatedCustomer = await prismaClient.customer.update({
      where: { id: +id },
      data: {
        previousDue: req.body.previousDue,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Customer previous due updated successfully",
      payload: {
        data: updatedCustomer,
      },
    });
  }
);
