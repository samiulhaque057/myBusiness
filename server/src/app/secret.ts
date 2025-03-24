import dotenv from "dotenv";

// config
dotenv.config();

export const port: string = process.env.SERVER_PORT || "5050";
export const hostname: string = process.env.SERVER_HOST || "127.0.0.1";

export const passwordResetSecret: string =
  "qwe232#$^%&^&@@VUHGHVGYV@@!!@XO&O@)(@)()@BYD";
export const passwordResetSecretExpire: string | number = 1000 * 60 * 5; // 5 min

export const passwordResetCookiesMaxAge: number = 1000 * 60 * 5; // 5 min

export const accessTokenSecret: string =
  "!@#$$%^&*()_DDFGFHJBU2345CGHBN*@^#$%%^&*";
export const accessTokenExpire: string | number = 1000 * 60 * 60 * 24 * 30; // // 30 day

export const accessCookiemaxAge: number = 1000 * 60 * 60 * 24 * 30; // 30 day

export const nodeEnv = process.env.NODE_ENV;
export const serverURL = process.env.SERVER_URL;
