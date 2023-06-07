import {
  type ErrorsManagerCodesStructure,
  type ErrorsManagerMessagesStructure,
} from "../types/types";

export const errorsManagerMessages: ErrorsManagerMessagesStructure = {
  server: "Error on starting the server!",
  notFoundDev: "Path not found.",
  notFoundUser: "Endpoint not found.",
  publicMessageDefault: "Something went wrong!. Try again.",
  registerPublicMessage: "The user couldn't be created. Try again!",
  wrongCredentialsMessage: "Wrong credentials",
  verificationMailError: "Email verification failed",
  getUserWrongEmail: "This user does not exist in our data base",
  passwordRecoveryError: "We couldn't restore your password. Please try again",
};

export const errorsManagerCodes: ErrorsManagerCodesStructure = {
  notFound: 404,
  generalErrorStatusCode: 500,
  registerErrorStatusCode: 409,
  wrongCredentialsStatusCode: 401,
};
