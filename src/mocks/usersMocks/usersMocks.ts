import {
  type UserCredentials,
  type UserRegisterCredentials,
} from "../../server/controllers/userControllers/types/types";

export const mockUserRegisterCredentials: UserRegisterCredentials = {
  email: "victor@andujar.org",
  password: "1234567890",
  name: "victor",
  surname: "Jhon",
  username: "ammavaru",
};

export const mockUserLoginCredentials: UserCredentials = {
  email: "victor@andujar.org",
  password: "1234567890",
};
