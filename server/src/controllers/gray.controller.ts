import { prismaClient } from "./../helper/prisma";
import asyncHandler from "express-async-handler";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";
import createError from "http-errors";

/**
 *
 * @description        Get All Grays
 * @method             GET
 *
 * @route              /api/v1/grays
 * @access             Private
 *
 * @params             [ page = number ]     default page = 1
 * @params             [ limit = number ]    min = 1, default = 10
 * @params             [ search query ]
 *
 * @success            { success : true , message, pagination , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Grays data found
 *
 */

interface DateQuery {
  gte?: string;
  lte?: string;
  eq?: string;
}

export const getAllGrays = asyncHandler(async (req: Request, res: Response) => {
  const dateQuery = req.query?.date as DateQuery;

  // get all grays from database
  const grays = await prismaClient.gray.findMany({
    include: {
      products: true,
      grayPayments: true,
      chalans: {
        include: {
          gray: true,
          products: {
            orderBy: {
              gray_date: "desc",
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
    },
  });

  // if data is empty
  // if (!grays.length)
  //   throw createError.NotFound("Couldn't find any grays data.");

  successResponse(res, {
    statusCode: 200,
    message: "All grays data fetched successfully.",
    payload: {
      total: grays?.length || 0,
      data: grays || [],
    },
  });
});

/**
 *
 * @description        Get gray by id
 * @method             GET
 *
 * @route              /api/v1/grays/:id
 * @access             Private
 *
 * @params             [ id = number ]
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Grays data found
 *
 */

export const getGrayById = asyncHandler(async (req: Request, res: Response) => {
  const dateQuery = req.query?.date as DateQuery;

  const gray = await prismaClient.gray.findUnique({
    where: {
      id: +req.params.id,
    },
    include: {
      // products: true,
      grayPayments: true,

      chalans: {
        include: {
          products: {
            include: {
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
      products: true,
    },
  });

  if (!gray) throw createError.NotFound("Counldn't find any gray data.");

  successResponse(res, {
    statusCode: 200,
    message: "gray data fetched successfully.",
    payload: {
      data: gray,
    },
  });
});

/**
 *
 * @description        Create new gray
 * @method             POST
 *
 * @route              /api/v1/grays
 * @access             Private
 *
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Bad Request 400 )   Invalid input
 *
 */

export const createGray = asyncHandler(async (req: Request, res: Response) => {
  // check name is exist or not
  const exist = await prismaClient.gray.findUnique({
    where: {
      phone: req.body.phone,
    },
  });
  if (exist) throw createError.BadRequest("Phone number already exist.");

  const gray = await prismaClient.gray.create({
    data: req.body,
  });

  successResponse(res, {
    statusCode: 201,
    message: "gray created successfully.",
    payload: {
      data: gray,
    },
  });
});

/**
 *
 * @description        Update gray by id
 * @method             PUT
 *
 * @route              /api/v1/grays/:id
 * @access             Private
 *
 * @params             [ id = number ]
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Grays data found
 *
 */

export const updateGrayById = asyncHandler(
  async (req: Request, res: Response) => {
    const exist = await prismaClient.gray.findUnique({
      where: { id: +req.params.id },
    });

    if (!exist) throw createError("Couldn't find gray by this id.");

    const gray = await prismaClient.gray.update({
      where: {
        id: +req.params.id,
      },
      data: req.body,
    });

    if (!gray) throw createError.NotFound("Couldn't find any gray data.");

    successResponse(res, {
      statusCode: 200,
      message: "gray updated successfully.",
      payload: {
        data: gray,
      },
    });
  }
);

/**
 *@description           Delete gray by id
 *@method                DELETE
 *
 *@route                 /api/v1/grays/:id
 *@access                private
 *
 *@success              { success : true  , data }
 *@failed               { success : false, error : { status : code , message} }
 *@error                ( Not Found 404 )   No Grays data found
 *
 */

export const deleteGrayById = asyncHandler(
  async (req: Request, res: Response) => {
    // find grey by id
    const gray = await prismaClient.gray.findUnique({
      where: { id: +req.params.id },
      include: {
        products: true,
        chalans: true,
        grayPayments: true,
      },
    });
    if (!gray) throw createError.NotFound("Couldn't find any gray data.");

    // // delete product related all data
    // gray?.products(async (product: any) => {
    //   // delete sell customer product data
    //   await prismaClient.customerProduct.deleteMany({
    //     where: { productId: product.id },
    //   });

    //   // delete all finished product data
    //   await prismaClient.finishedProduct.deleteMany({
    //     where: {
    //       productId: product.id,
    //     },
    //   });

    //   // delete all releated table data
    // });

    // delete related gray chalan
    await prismaClient.grayChalan.deleteMany({
      where: {
        grayId: +req.params.id,
      },
    });

    // delete releted product
    await prismaClient.product.deleteMany({
      where: {
        grayId: +req.params.id,
      },
    });

    // delete releted chalans
    await prismaClient.grayChalan.deleteMany({
      where: {
        grayId: +req.params.id,
      },
    });
    // delete releted product payments
    await prismaClient.grayPayment.deleteMany({
      where: {
        grayId: +req.params.id,
      },
    });

    // delete gray data
    await prismaClient.gray.delete({
      where: {
        id: +req.params.id,
      },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Gray data deleted successfully.",
      payload: {
        data: gray,
      },
    });
  }
);

// gray payment
export const grayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { chalanId, grayId } = req.body;

  // gray check
  const gray = await prismaClient.gray.findUnique({
    where: {
      id: grayId,
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
  if (!gray) throw createError.NotFound("Gray or chalan data not found!");

  // create gray payment
  const payment = await prismaClient.grayPayment.create({
    data: {
      amount: req.body.amount,
      chalanId: chalanId,
      grayId: grayId,
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
});

// get total gray payemnt
export const getAllGrayPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const dateQuery = req.query?.date as DateQuery;

    const payments = await prismaClient.grayPayment.findMany({
      include: {
        gray: true,
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
      message: "All grays payments data",
      payload: {
        data: payments?.length ? payments : [],
      },
    });
  }
);

// update gray payment by id
export const updateGrayPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const payment = await prismaClient.grayPayment.findUnique({
      where: { id: +id },
    });

    if (!payment) throw createError.NotFound("Payment not found!");

    const updatedPayment = await prismaClient.grayPayment.update({
      where: { id: +id },
      data: { ...req.body, date: req.body?.date?.split("T")[0] },
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
export const deleteGrayPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const payment = await prismaClient.grayPayment.findUnique({
      where: { id: +id },
    });

    if (!payment) throw createError.NotFound("Payment not found!");

    // delete
    await prismaClient.grayPayment.delete({
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

// get all gray chalan
export const getAllGrayChalans = asyncHandler(
  async (_req: Request, res: Response) => {
    const chalans = await prismaClient.grayChalan.findMany();

    if (chalans.length)
      throw createError.NotFound("Couldn't find any gray chalans");

    successResponse(res, {
      statusCode: 200,
      message: "All Chalans data fetched successfully.",
    });
  }
);

// delete gray chalan by id
export const deleteGrayChalanById = asyncHandler(
  async (req: Request, res: Response) => {
    const chalan = await prismaClient.grayChalan.findUnique({
      where: {
        id: +req.params.id,
      },
    });
    if (!chalan) throw createError.NotFound("Couldn't find any chalan data.");
    await prismaClient.grayChalan.delete({
      where: {
        id: +req.params.id,
      },
    });
    successResponse(res, {
      statusCode: 200,
      message: "Successfully deleted gray chalan",
      payload: {
        data: chalan,
      },
    });
  }
);

// toggle gray marked
export const toggleGrayChalanMarkedById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const chalan = await prismaClient.grayChalan.findUnique({
      where: { id: +id },
    });

    if (!chalan) throw createError.NotFound("Chalan not found!");

    const updatedChalan = await prismaClient.grayChalan.update({
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
