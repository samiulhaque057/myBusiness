import { prismaClient } from "./../helper/prisma";
import asyncHandler from "express-async-handler";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";
import createError from "http-errors";
import { formatISO } from "date-fns";

/**
 *
 * @description        Get All Dyeings
 * @method             GET
 *
 * @route              /api/v1/dyeing
 * @access             Private
 *
 * @params             [ page = number ]     default page = 1
 * @params             [ limit = number ]    min = 1, default = 10
 * @params             [ search query ]
 *
 * @success            { success : true , message, pagination , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Dyeings data found
 *
 */

interface DateQuery {
  gte?: string;
  lte?: string;
  eq?: string;
}

export const getAllDyeings = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;
    // get all dyeing from database
    const dyeings = await prismaClient.dyeing.findMany({
      include: {
        products: {
          include: {
            gray: true,
            dyeing: true,
          },
        },
        chalans: {
          include: {
            payments: true,
            products: true,
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
        dyeingPayments: true,
      },
    });

    // if data is empty
    // if (!dyeings.length)
    //   throw createError.NotFound("Couldn't find any dyeing data.");

    successResponse(res, {
      statusCode: 200,
      message: "All dyeing data fetched successfully.",
      payload: {
        total: dyeings.length || 0,
        data: dyeings || 0,
      },
    });
  }
);

/**
 *
 * @description        Get dyeing by id
 * @method             GET
 *
 * @route              /api/v1/dyeing/:id
 * @access             Private
 *
 * @params             [ id = number ]
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Dyeings data found
 *
 */

export const getDyeingById = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;
    const dyeing = await prismaClient.dyeing.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        products: {
          include: {
            // dyeing_payments: true,
            gray: true,
            dyeing: true,
          },
        },
        chalans: {
          include: {
            products: {
              include: {
                finished_products: true,
                gray: true,
                dyeing: true,
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
        dyeingPayments: true,
      },
    });

    if (!dyeing) throw createError.NotFound("Counldn't find any dyeing data.");

    successResponse(res, {
      statusCode: 200,
      message: "dyeing data fetched successfully.",
      payload: {
        data: dyeing,
      },
    });
  }
);

/**
 *
 * @description        Create new dyeing
 * @method             POST
 *
 * @route              /api/v1/dyeing
 * @access             Private
 *
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Bad Request 400 )   Invalid input
 *
 */

export const createDyeing = asyncHandler(
  async (req: Request, res: Response) => {
    const isExist = await prismaClient.dyeing.findUnique({
      where: { phone: req.body.phone },
    });

    if (isExist) throw createError.Conflict("Phone number already exixt.");

    const dyeing = await prismaClient.dyeing.create({
      data: req.body,
    });

    successResponse(res, {
      statusCode: 201,
      message: "dyeing created successfully.",
      payload: {
        data: dyeing,
      },
    });
  }
);

/**
 *
 * @description        Update dyeing by id
 * @method             PUT
 *
 * @route              /api/v1/dyeing/:id
 * @access             Private
 *
 * @params             [ id = number ]
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Dyeings data found
 *
 */

export const updateDyeingById = asyncHandler(
  async (req: Request, res: Response) => {
    const exist = await prismaClient.dyeing.findUnique({
      where: { id: +req.params.id },
    });

    if (!exist) throw createError("Couldn't find dyeing by this id.");

    const dyeing = await prismaClient.dyeing.update({
      where: {
        id: +req.params.id,
      },
      data: req.body,
    });

    if (!dyeing) throw createError.NotFound("Couldn't find any dyeing data.");

    successResponse(res, {
      statusCode: 200,
      message: "dyeing updated successfully.",
      payload: {
        data: dyeing,
      },
    });
  }
);

/**
 *@description           Delete dyeing by id
 *@method                DELETE
 *
 *@route                 /api/v1/dyeing/:id
 *@access                private
 *
 *@success              { success : true  , data }
 *@failed               { success : false, error : { status : code , message} }
 *@error                ( Not Found 404 )   No Dyeings data found
 *
 */

export const deleteDyeingById = asyncHandler(
  async (req: Request, res: Response) => {
    const dyeing = await prismaClient.dyeing.findUnique({
      where: { id: +req.params.id },
    });
    if (!dyeing) throw createError.NotFound("Couldn't find any dyeing data.");

    // delete
    await prismaClient.dyeing.delete({
      where: {
        id: +req.params.id,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Dyeing data deleted successfully.",
      payload: {
        data: dyeing,
      },
    });
  }
);

// dyeing payment
export const dyeingPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { dyeingId, chalanId } = req.body;

    // dyeing check
    const dyeing = await prismaClient.dyeing.findUnique({
      where: {
        id: dyeingId,
        chalans: {
          some: {
            id: chalanId,
          },
        },
      },
      include: {
        chalans: true,
      },
    });
    if (!dyeing) throw createError.NotFound("Dyeing or chalan data not found!");

    // create dyeing payment
    const payment = await prismaClient.dyeingPayment.create({
      data: {
        amount: req.body.amount,
        chalanId: chalanId,
        dyeingId: dyeingId,
        date: req.body?.date?.split("T")[0],
      },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Payment successfully",
      payload: {
        data: payment,
      },
    });
  }
);

// get total gray payemnt
export const getAllDyeingPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;

    const payments = await prismaClient.dyeingPayment.findMany({
      include: {
        dyeing: true,
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

    successResponse(res, {
      statusCode: 200,
      message: "All dyeing payments data",
      payload: {
        data: payments.length ? payments : [],
      },
    });
  }
);

// update dyeing payment by id
export const updateDyeingPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const payment = await prismaClient.dyeingPayment.findUnique({
      where: { id: +id },
    });

    if (!payment) throw createError.NotFound("Payment not found!");

    const updatedPayment = await prismaClient.dyeingPayment.update({
      where: { id: +id },
      data: req.body,
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Payment updated successfully",
      payload: {
        data: updatedPayment,
      },
    });
  }
);

// delete payment by id
export const deleteDyeingPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const payment = await prismaClient.dyeingPayment.findUnique({
      where: { id: +id },
    });

    if (!payment) throw createError.NotFound("Payment not found!");

    // delete
    await prismaClient.dyeingPayment.delete({
      where: { id: +id },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Payment deleted successfully",
      payload: {
        data: payment,
      },
    });
  }
);

// update dyeing chalan product
export const updateDyeingChalanProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = req.body;

    const updatedProducts =
      products?.length &&
      (await Promise.all(
        products.map(async (product: any) => {
          // dyeing date provide
          if (product.dyeing_date) {
            product.dyeing_date = formatISO(
              new Date(product.dyeing_date)
            ).split("T")[0];
          }

          const updatedProduct = await prismaClient.product.update({
            where: { id: +product.id },
            data: {
              ...product,
            },
          });
          return updatedProduct;
        })
      ));

    // console.log(updatedProducts);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Chalan updated successfully",
      payload: {
        data: updatedProducts,
      },
    });
  }
);

// toggle dyeing marked
export const toggleDyeingChalanMarkedById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const chalan = await prismaClient.dyeingChalan.findUnique({
      where: { id: +id },
    });

    if (!chalan) throw createError.NotFound("Chalan not found!");

    const updatedChalan = await prismaClient.dyeingChalan.update({
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
