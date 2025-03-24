import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { successResponse } from "../helper/responseHandler";
import { prismaClient } from "../helper/prisma";
import hassPassword from "../helper/hashPassword";

/**
 *
 * @description    Get All Users Data
 * @method         GET
 *
 * @route          /api/v1/users
 * @access          Private
 *
 * @params         [ page = number ]     default page = 1
 * @params         [ limit = number ]    min = 1, default = 10
 * @params         [ search query ]
 *
 *
 * @success        { success : true , message, pagination , data }
 * @failed         { success : false, error : { status : code , message} }
 * @error          ( Not Found 404 )   No User data found
 *
 */

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  // search query fields
  // const searchFields = ["name", "email", "phone"];

  // default page and limit value
  req.query.page = req.query.page || "1";
  req.query.limit = req.query.limit || "10";

  // find users data and add links
  // const { users, pagination } = {};
  const users = await prismaClient.user.findMany({});

  // if no user found
  if (!users.length) throw createError.NotFound("Couldn't find any users data");

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User data fetched successfully",
    payload: {
      // pagination,
      data: users,
    },
  });
});

/**
 *
 * @description    Get user by id
 * @method         GET
 *
 * @route          /api/v1/users/:id
 * @access          Private
 *
 * @success        { success : true , message , data }
 * @failed         { success : false, error : { status : code , message} }
 * @error          ( Not Found 404 )   No User data found
 *
 */

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma?.user.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (!user) throw createError.NotFound("Couldn't find any user data.");

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User data fetched successfully",
    payload: {
      data: user,
    },
  });
});

/**
 *
 * @description    Update user by id
 * @method         PUT
 *
 * @route          /api/v1/users/:id
 * @access          Private
 *
 * @success        { success : true , message , data }
 * @failed         { success : false, error : { status : code , message} }
 * @error          ( Not Found 404 )   No User data found
 *
 */

export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;

    if (req.body?.password) {
      data.password = hassPassword(req.body.password);
    }

    // user check
    const user = await prisma?.user.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (!user) throw createError.NotFound("Couldn't find any user data.");

    const updatedUser = await prisma?.user.update({
      where: {
        id: +req.params.id,
      },
      data,
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "User data updated successfully",
      payload: {
        data: updatedUser,
      },
    });
  }
);

/**
 * @description         Delete user by id
 * @method              DELETE
 *
 * @route               /api/v1/users/:id
 * @access              Private [admin]
 *
 * @param               [id =number]
 *
 * @success             { success : true , message , data }
 * @failed              { success : false, error : { status : code , message} }
 * @error               ( Not Found 404 )   No User data found
 */

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response) => {
    // const user = await prisma?.user.findUnique({
    //   where: {
    //     id: +req.params.id,
    //   },
    // });
    // if (!user) throw createError.NotFound("Couldn't find any user data.");

    // deleted user
    const deletedUser = await prisma?.user.delete({
      where: {
        id: +req.params.id,
      },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "User data deleted successfully",
      payload: {
        data: deletedUser,
      },
    });
  }
);

/**
 * @description         Create User By Admin
 * @method              POST
 *
 * @route               /api/v1/users
 * @access              Private[admin]
 *
 * @body                { }
 *
 * @success             { success : true , message , data }
 * @failed              { success : false, error : { status : code , message} }
 * @error               ( Not Found 404 )   No User data found
 *
 */

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
  };

  if (req.body.password) {
    data.password = hassPassword(req.body.password);
  }

  const user = await prismaClient.user.create({
    data,
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User created successfully",
    payload: {
      data: user,
    },
  });
});
