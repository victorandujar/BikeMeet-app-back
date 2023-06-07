import { type JwtPayload } from "jsonwebtoken";

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
