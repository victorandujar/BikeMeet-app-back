import { type JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import type * as core from "express-serve-static-core";

export interface UserRegisterCredentials {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  confirmationCode: string | undefined;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
}

export interface UserToVerifyStructure {
  confirmationCode: string;
}

export interface RecoveryPasswordStructure {
  _id: string;
  password: string;
}

export interface UserDataStructure {
  name: string;
  surname: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  rides: number;
  rate: number;
  image: string;
  location: string;
  _id: string;
}

export interface CustomUserRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  owner: string;
}
