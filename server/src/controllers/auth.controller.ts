import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import createError from "http-errors";
import { clearCookie, setCookie } from "../helper/cookies";
import createJWT from "../helper/createJWT";
import jwt from "jsonwebtoken";
import {
  accessCookiemaxAge,
  accessTokenExpire,
  accessTokenSecret,
  passwordResetCookiesMaxAge,
  passwordResetSecret,
  passwordResetSecretExpire,
} from "../app/secret";
import { errorResponse, successResponse } from "../helper/responseHandler";
import { RequestWithUser } from "../app/definition";
import randomCodeGenerator from "../helper/randomCodeGeneraor";
import { prismaClient } from "../helper/prisma";
import hassPassword from "../helper/hashPassword";
/**
 * @description      User Login
 * @method           POST
 *
 * @route            /api/v1/auth/login
 * @access           Public
 *
 * @body             {email,password}
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 * @error              ( Not Found 404 )   No user data found
 */

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prismaClient?.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw createError.NotFound("Couldn't find any user data. ");
  } else {
    //  password match
    const isMatchPassword = bcrypt.compareSync(password, user.password);

    if (!isMatchPassword)
      throw createError(400, "Wrong password. Please try again.");
  }

  // create  access token
  const accessToken = await createJWT(
    { email, role: user.role },
    accessTokenSecret,
    accessTokenExpire
  );

  // access token set to cookie
  setCookie({
    res,
    cookieName: "accessToken",
    cookieValue: accessToken,
    maxAge: accessCookiemaxAge,
  });

  successResponse(res, {
    statusCode: 200,
    message: "User data fetched successfully.",
    payload: {
      data: {
        ...user,
        accessToken,
      },
    },
  });
});

/**
 * @description      User Logout
 * @method           POST
 *
 * @route            /api/v1/auth/logout
 * @access           Private
 *
 * @cookie             accessToken
 *
 * @success            { success : true  , data }
 * @failed             { success : false, error : { status : code , message} }
 */

export const userLogout = asyncHandler(async (_req: Request, res: Response) => {
  // clear cookies
  clearCookie(res, "accessToken");

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Logout.",
  });
});

/**
 *
 * @description    Login User Data
 * @method         GET
 *
 * @route          /api/v1/auth/me
 * @access         Login User
 *
 * @success        { success : true , message, data:{} }
 * @failed         { success : false, error : { status : code , message} }
 *
 */

export const loggedInUser = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    if (!req?.me) throw createError(404, "Couldn't find any user.");

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Login user data.",
      payload: {
        data: req.me,
      },
    });
  }
);

/**
 * @description       Forgot  Password
 * @method            POST
 *
 * @route              /api/v1/auth/forgot-password
 * @access             Public
 *
 * @dody               { email }
 *
 * @success             { success : true , message , code }
 * @failed              { success : false, error : { status : code , message} }
 * @error               ( Not Found 404 )   No User data found
 *
 */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prismaClient?.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw createError.NotFound("Couln't find any user account.");

    // code generate
    const code = randomCodeGenerator(5);

    // email data
    const emailData = {
      to: user.email,
      subject: "Password Reset Code",
      code,
    };

    console.log(emailData);

    // email send
    // await sendEmail(emailData);

    // password reset token
    const resetToken = await createJWT(
      {
        email: user.email,
        code,
      },
      passwordResetSecret,
      passwordResetSecretExpire
    );

    setCookie({
      res,
      cookieName: "resetToken",
      cookieValue: resetToken,
      maxAge: passwordResetCookiesMaxAge,
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Password reset code sent successfully",
      payload: {
        code,
      },
    });
  }
);

/**
 * @description         Reset Password
 * @method              POST
 *
 * @route               /api/v1/auth/reset-password
 * @access              Public
 *
 * @body                {code,token ,newPassword,oldPassword}
 *
 * @success             { success : true , message , data }
 * @failed              { success : false, error : { status : code , message} }
 * @error               ( Not Found 404 )   No User data found
 *
 */

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, newPassword } = req.body;

    const resetToken = req.cookies.resetToken;

    if (!resetToken) throw createError.NotFound("Reset token not found.");

    jwt.verify(
      resetToken,
      passwordResetSecret,
      async (err: any, decode: any) => {
        if (err) {
          // clear cookie
          clearCookie(res, "resetToken");

          // response send
          return errorResponse(res, {
            statusCode: 400,
            message: "Unauthorized, Invalid access token.Please login again.",
          });
        }

        // find user
        const user = await prismaClient.user.findUnique({
          where: { email: decode?.email },
        });

        // if user not exist
        if (!user) {
          // send response
          return errorResponse(res, {
            statusCode: 400,
            message: "Reset token email not found.",
          });
        }

        if (code != decode.code) {
          return errorResponse(res, {
            statusCode: 400,
            message: "Code doesn't match.",
          });
        }

        // update user password

        const updatedUser = await prismaClient.user.update({
          where: {
            email: decode.email,
          },
          data: {
            password: hassPassword(newPassword),
          },
        });
        // clear cookie
        clearCookie(res, "resetToken");

        // response send
        successResponse(res, {
          statusCode: 200,
          message: "Password reset successfully",
          payload: {
            data: updatedUser,
          },
        });
      }
    );
  }
);
