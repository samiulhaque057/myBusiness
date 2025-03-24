import { prismaClient } from "./../helper/prisma";
import asyncHandler from "express-async-handler";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";
import createError from "http-errors";
import { formatISO } from "date-fns";

/**
 *
 * @description        Get All Products
 * @method             GET
 *
 * @route              /api/v1/products
 * @access             Private
 *
 * @params             [ page = number ]     default page = 1
 * @params             [ limit = number ]    min = 1, default = 10
 * @params             [ search query ]
 *
 * @success            { success : true , message, pagination , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Products data found
 *
 */

export const getAllProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    // get all products from database
    const products = await prismaClient.product.findMany({
      include: {
        gray: true,
        dyeing: true,
        finished_products: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });

    // if data is empty
    // if (!products.length)
    //   throw createError.NotFound("Couldn't find any product data.");

    successResponse(res, {
      statusCode: 200,
      message: "All Products data fetched successfully.",
      payload: {
        totalProduct: products?.length,
        data: products || [],
      },
    });
  }
);

/**
 *
 * @description        Get product by id
 * @method             GET
 *
 * @route              /api/v1/products/:id
 * @access             Private
 *
 * @params             [ id = number ]
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Products data found
 *
 */

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await prismaClient.product.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        gray: true,
        dyeing: true,
        finished_products: true,
      },
    });

    if (!product)
      throw createError.NotFound("Counldn't find any product data.");

    successResponse(res, {
      statusCode: 200,
      message: "Product data fetched successfully.",
      payload: {
        data: product,
      },
    });
  }
);

/**
 *
 * @description        Create new product
 * @method             POST
 *
 * @route              /api/v1/products
 * @access             Private
 *
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Bad Request 400 )   Invalid input
 *
 */

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { grayId } = req.body;

    // gray id check
    const gray = await prismaClient.gray.findUnique({
      where: { id: +grayId },
    });

    if (!gray) throw createError("Couldn't find any gray by grayId.");

    console.log(req.body);

    // chalan create for this product with gray id
    const chalan = await prismaClient.grayChalan.create({
      data: {
        grayId: +grayId,
        date: req.body?.gray_date
          ? req.body?.gray_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      },
    });

    // if provide dyeing id then create idyeing chalan
    let dyeingChalanId = null;
    if (req.body?.dyeingId) {
      const dyeingChalan = await prismaClient.dyeingChalan.create({
        data: {
          dyeingId: +req.body?.dyeingId,
          date: new Date().toISOString().split("T")[0],
        },
      });
      dyeingChalanId = dyeingChalan.id;
    }

    // create data
    const createdData = {
      ...req.body,
      grayChalanId: chalan.id,
      delivery_status: "RUNNING",
      gray_date: req.body?.gray_date
        ? req.body?.gray_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    if (dyeingChalanId) createdData.dyeingChalanId = dyeingChalanId;

    const product = await prismaClient.product.create({
      data: {
        ...createdData,
      },
    });

    successResponse(res, {
      statusCode: 201,
      message: "Product created successfully.",
      payload: {
        data: product,
      },
    });
  }
);

/**
 *
 * @description        Update product by id
 * @method             PUT
 *
 * @route              /api/v1/products/:id
 * @access             Private
 *
 * @params             [ id = number ]
 * @body               { name, description, price, stock }
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No Products data found
 *
 */

export const updateProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const exist = await prismaClient.product.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!exist) throw createError.NotFound("Couldn't find any product data.");

    const updatedData = {
      ...req.body,
    };
    if (updatedData?.gray_date) {
      updatedData.gray_date = updatedData.gray_date.split("T")[0];
    }
    // if dyeing id provide create dyeing chalan id
    if (updatedData?.dyeingId && !exist?.dyeingChalanId) {
      const dyeingChalan = await prismaClient.dyeingChalan.create({
        data: {
          dyeingId: updatedData.dyeingId,
          date: new Date().toISOString().split("T")[0],
        },
      });
      updatedData.dyeingChalanId = dyeingChalan.id;
    }

    const product = await prismaClient.product.update({
      where: { id: +req.params.id },
      data: updatedData,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully.",
      payload: {
        data: product,
      },
    });
  }
);

/**
 *@description           Delete product by id
 *@method                DELETE
 *
 *@route                 /api/v1/products/:id
 *@access                private
 *
 *@success              { success : true  , data }
 *@failed               { success : false, error : { status : code , message} }
 *@error                ( Not Found 404 )   No Products data found
 *
 */

export const deleteProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const exist = await prismaClient.product.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!exist) throw createError.NotFound("Couldn't find any product data.");

    // delete product
    await prismaClient.product.delete({
      where: { id: +req.params.id },
    });

    successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully.",
      payload: {
        data: exist,
      },
    });
  }
);

/**
 *@description           Product  add to dyeing
 *@method                PATCH
 *
 *@route                 /api/v1/products/add-to-dyeing
 *@access                private
 *
 *@success              { success : true  , data }
 *@failed               { success : false, error : { status : code , message} }
 *@error                ( Not Found 404 )   No Products data found
 *
 */

export const productAddToDyeing = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, dyeingId } = req.body;

    // product check
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw createError.NotFound("Couldn't find any product.");

    // dyeing check
    const dyeing = await prismaClient.dyeing.findUnique({
      where: { id: dyeingId },
    });
    if (!dyeing)
      throw createError.NotFound("Couldn't find dyeing id in database.");

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        dyeingId,
        dyeing_date: req.body.dyeing_date,
        dyeing_rate: req.body.dyeing_rate,
        // thaan_amount: req.body.thaan_amount,
      },
    });

    // update chalan data
    // await prismaClient.chalan.update({
    //   where: { chalanNumber: product.chalanNumber },
    //   data: {
    //     productId: updatedProduct.id,
    //     dyeingId: updatedProduct.dyeingId,
    //   },
    // });

    successResponse(res, {
      statusCode: 200,
      message: "Product Add to Dyeing",
      payload: {
        data: updatedProduct,
      },
    });
  }
);

// thaan count
export const countFinishedProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, finishedProducts } = req.body;

    // product check
    const product = await prismaClient.product.findUnique({
      where: { id: +productId },
    });

    // if product not found
    if (!product) throw createError.NotFound("Couldn't find any product.");

    // update product data

    if (!product) throw createError.NotFound("Couldn't find any product.");

    // thaan data
    const finishedProduct = await prismaClient.finishedProduct.createMany({
      data: finishedProducts?.map((thaan: any) => {
        return {
          ...thaan,
          productId,
        };
      }),
    });

    successResponse(res, {
      statusCode: 200,
      message: "Thaan Count Add to Product",
      payload: {
        data: finishedProduct,
      },
    });
  }
);

// update multiple thaan data
export const updateMultipleFinishedData = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, finishedProducts } = req.body;

    // product check
    const product = await prismaClient.product.findUnique({
      where: { id: +productId },
    });

    if (!product) throw createError.NotFound("Couldn't find any product.");

    // // update product data
    // if (product?.total_defected !== +total_defected) {
    //   await prismaClient.product.update({
    //     where: {
    //       id: +productId,
    //     },
    //     data: {
    //       total_defected: +total_defected,
    //     },
    //   });
    // }

    // update finished product data and return data
    const updatedFinishedProduct = await Promise.all(
      finishedProducts?.map(async (item: any) => {
        const finishedProduct = await prismaClient.finishedProduct.update({
          where: {
            id: item.id,
          },
          data: item,
        });
        return finishedProduct;
      })
    );

    successResponse(res, {
      statusCode: 200,
      message: "Thaan data updated successfully.",
      payload: {
        data: updatedFinishedProduct,
      },
    });
  }
);

// update thaan by id
export const updateThaanById = asyncHandler(
  async (_req: Request, res: Response) => {
    // const { id } = req.params;
    // const thaan = await prismaClient.thaanCount.update({
    //   where: {
    //     id: +id,
    //   },
    //   data: req.body,
    // });

    successResponse(res, {
      statusCode: 200,
      message: "Thaan data updated successfully.",
      payload: {
        data: {},
      },
    });
  }
);

// delete thaan by id
export const deleteThaanById = asyncHandler(
  async (_req: Request, res: Response) => {
    // const { id } = req.params;
    // const thaan = await prismaClient.thaanCount.delete({
    //   where: {
    //     id: +id,
    //   },
    // });

    successResponse(res, {
      statusCode: 200,
      message: "Thaan data deleted successfully.",
      payload: {
        data: {},
      },
    });
  }
);

// gray, dyeing and product create together
export const createGrayDyeingProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { gray_phone, products, gray_name, date } = req.body;

    let grayId = null;
    //  check gray Name
    const gray = await prismaClient.gray.findUnique({
      where: {
        phone: gray_phone,
      },
    });

    // create gray if not foun grayid
    if (!gray) {
      const grayData = await prismaClient.gray.create({
        data: {
          name: gray_name,
          address: req.body?.gray_address,
          phone: req.body?.gray_phone,
        },
      });
      // set gray id
      grayId = grayData.id;
    } else {
      grayId = gray.id;
    }

    console.log(date, new Date());

    // create gray chalan
    const grayChalan = await prismaClient.grayChalan.create({
      data: {
        grayId,
        date: date,
      },
    });

    // create dyeing chalan
    const dyeingsIds = products?.reduce((acc: any, product: any) => {
      if (product?.dyeingId) {
        // acc.push(product.dyeingId);
        if (!acc.includes(product.dyeingId)) {
          acc.push(product.dyeingId);
        }
      }
      return acc;
    }, []);

    const dyeingChalanIds = await Promise.all(
      dyeingsIds?.map(async (id: any) => {
        const dyeingChalan = await prismaClient.dyeingChalan.create({
          data: {
            dyeingId: id,
            date: date,
          },
        });
        return { dyeingId: id, id: dyeingChalan.id };
      })
    );

    let updatedProducts = products?.map((product: any) => {
      if (product?.dyeingId) {
        const dyeingChalanId = dyeingChalanIds.find(
          (item: any) => item.dyeingId === product.dyeingId
        )?.id;

        return {
          ...product,
          dyeingChalanId,
        };
      }
      return product;
    });

    // create multiple products
    const createdProducts = await prismaClient.product.createMany({
      data: updatedProducts.map((product: any) => {
        // delete dyeing_name
        delete product.dyeing_name;
        return {
          ...product,
          grayId,
          grayChalanId: grayChalan.id,
          delivery_status: product?.dyeingId ? "IN_MILL" : "RUNNING",
          gray_date: formatISO(new Date()).split("T")[0],
        };
      }),
    });

    successResponse(res, {
      statusCode: 201,
      message: "Gray, Dyeing and Product created successfully.",
      payload: {
        data: {
          gray,
          products: createdProducts,
        },
      },
    });
  }
);

// purchase product
export const purchaseProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { customer, products, payment } = req.body;

    let customerId = null;
    // if customer is new
    if (!customer?.beforeData) {
      const exist = await prismaClient.customer.findUnique({
        where: {
          phone: customer?.phone,
        },
      });

      if (exist) throw createError.Conflict("Phone number already exist.");

      const newCustomer = await prismaClient.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
      });
      customerId = newCustomer.id;
    } else {
      customerId = customer.id;
    }

    // create customer chalan data
    const customerChalan = await prismaClient.customerChalan.create({
      data: {
        customerId: +customerId,
        date: new Date().toISOString().split("T")[0],
        discount: customer?.discount,
        markedPaid: customer?.markedPaid,
      },
    });

    // create customer product data and update finished product data
    products?.map(async (product: any) => {
      // crease customer product
      const productData = await prismaClient.customerProduct.create({
        data: {
          customerId: +customerId,
          productId: +product.id,
          product_rate: +product.sellRate,
          chalanId: customerChalan.id,
        },
      });

      // update finished product data
      const finished_product = product?.items?.map(async (item: any) => {
        await prismaClient.finishedProduct.update({
          where: {
            id: +item.id,
          },
          data: {
            is_sold: true,
            customerProductId: productData.id,
          },
        });
      });

      return finished_product;
    });

    // if payment done
    if (payment?.amount) {
      const chalanPayment = await prismaClient.customerPayment.create({
        data: {
          customerId: +customerId,
          amount: +payment.amount,
          date: new Date().toISOString().split("T")[0],
          customerChalanId: customerChalan.id,
        },
      });

      // update customer chalan with paymentWithPurchaseId
      await prismaClient.customerChalan.update({
        where: {
          id: customerChalan.id,
        },
        data: {
          paymentWithPurchaseId: chalanPayment?.id,
        },
      });
    }

    successResponse(res, {
      statusCode: 201,
      message: "Product purchased successfully",
      payload: {
        data: null,
      },
    });
  }
);

// update purchase product
export const updatePurchaseProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { customer, products, payment } = req.body;

    const chalan = await prismaClient.customerChalan.findUnique({
      where: { id: +req.params.id },
      include: {
        customerProducts: true,
      },
    });

    if (!chalan) throw createError.NotFound("Customer chalan not found.");

    // update customer chalan data
    await prismaClient.customerChalan.update({
      where: { id: +req.params.id },
      data: {
        discount: customer.discount,
        markedPaid: customer.markedPaid,
      },
    });

    // payment add
    if (payment) {
      if (payment?.paymentData?.amount) {
        await prismaClient.customerPayment.update({
          where: {
            id: payment?.paymentData?.id,
          },
          data: {
            amount: payment.amount || 0,
          },
        });
      } else if (payment?.amount) {
        const chalanPayment = await prismaClient.customerPayment.create({
          data: {
            customerId: +customer?.id,
            amount: +payment?.amount || 0,
            date: new Date().toISOString().split("T")[0],
            customerChalanId: chalan.id,
          },
        });
        // update customer chalan with paymentWithPurchaseId
        await prismaClient.customerChalan.update({
          where: {
            id: chalan.id,
          },
          data: {
            paymentWithPurchaseId: chalanPayment?.id,
          },
        });
      }
    }

    console.log(req.body);

    // before purchase all product remove from customer products and finished product will be is_sold:false

    // is_sold false for before purchase product
    await prismaClient.finishedProduct.updateMany({
      where: {
        customerProduct: {
          chalanId: chalan.id,
        },
      },
      data: {
        is_sold: false,
      },
    });

    await prismaClient.customerProduct.deleteMany({
      where: {
        chalanId: +req?.params?.id,
      },
    });

    // create customer product data and update finished product data
    products?.map(async (product: any) => {
      // crease customer product
      const productData = await prismaClient.customerProduct.create({
        data: {
          customerId: +customer?.id,
          productId: +product.id,
          product_rate: +product.sellRate,
          chalanId: chalan.id,
        },
      });

      // update finished product data
      const finished_product = product?.items?.map(async (item: any) => {
        await prismaClient.finishedProduct.update({
          where: {
            id: +item.id,
          },
          data: {
            is_sold: true,
            customerProductId: productData.id,
          },
        });
      });

      return finished_product;
    });

    // // if change payment done
    // if (payment?.amount) {
    //   await prismaClient.customerPayment.create({
    //     data: {
    //       customerId: +customerId,
    //       amount: +payment.amount,
    //       date: new Date().toISOString().split("T")[0],
    //       customerChalanId: customerChalan.id,
    //     },
    //   });
    // }

    successResponse(res, {
      statusCode: 201,
      message: "Product purchased successfully",
      payload: {
        data: null,
      },
    });
  }
);

// add product defect
export const updateFinishedProductDefectById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: {
        total_defected: +req.body.defect,
      },
    });

    if (!product) throw createError.NotFound("Product Not Found.");

    successResponse(res, {
      statusCode: 200,
      message: "Update product defect",
      payload: {
        data: product,
      },
    });
  }
);
