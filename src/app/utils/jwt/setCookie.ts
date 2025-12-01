import { Response } from "express";

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

export const setCookie = (res: Response, tokenInfo: IAuthToken) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  }
};
