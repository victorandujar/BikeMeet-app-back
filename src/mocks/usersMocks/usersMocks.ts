import {
  type UserToVerifyStructure,
  type UserCredentials,
  type UserRegisterCredentials,
  type UserDataStructure,
} from "../../server/controllers/userControllers/types/types";

export const mockUserRegisterCredentials: UserRegisterCredentials = {
  email: "victor@andujar.org",
  password: "1234567890",
  name: "victor",
  surname: "Jhon",
  username: "ammavaru",
  confirmationCode: "kdjfkldsjfklasdf",
  isVerified: false,
};

export const mockUserLoginCredentials: UserCredentials = {
  email: "victor@andujar.org",
  password: "1234567890",
};

export const mockUserVerified: UserRegisterCredentials = {
  name: "Victor",
  surname: "Andújar",
  username: "Ammavaru",
  email: "victorandujarmurcia@gmail.com",
  password: "$2a$10$tyDXn5gkPVE5ysQiq9KZ2uN8TMYPbCAhDLykFdNhFGf7diED2Ehae",
  isVerified: true,
  confirmationCode: undefined,
};

export const mockUserToVerify: UserToVerifyStructure = {
  confirmationCode: "kdjfkldsjfklasdf",
};

export const mockUserData: UserDataStructure = {
  name: "Victor",
  surname: "Andújar",
  username: "Ammavaru",
  email: "victorandujarmurcia@gmail.com",
  followers: ["dkdkfjjdklfdj"],
  following: ["dfkljdsfkldjskld"],
  image: "kfdjdsklfjdsklfj",
  location: "dkfljdsklfjdsklf",
  rate: 5,
  rides: 2,
};
