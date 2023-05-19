import { type JwtPayload } from "jsonwebtoken";

export interface UserRegisterCredentials {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
}
