import {
  type RidesErrorManagerMessagesStructure,
  type ErrorsManagerCodesStructure,
  type UserErrorsManagerMessagesStructure,
} from "../types/types";

export const userErrorsManagerMessages: UserErrorsManagerMessagesStructure = {
  server: "Error on starting the server!",
  notFoundDev: "Path not found",
  notFoundUser: "Endpoint not found",
  publicMessageDefault: "Something went wrong!. Try again",
  registerPublicMessage: "The user couldn't be created. Try again!",
  wrongCredentialsMessage: "Wrong credentials",
  verificationMailError: "Email verification failed",
  getUserWrongEmail: "This user does not exist in our data base",
  passwordRecoveryError: "We couldn't restore your password. Please try again",
};

export const ridesErrorsManagerStructure: RidesErrorManagerMessagesStructure = {
  notFoundRides: "We couldn't retrieve rides. Try again!",
  notFoundRide: "The ride could not be found",
  notCreatedRide: "The ride could not be created",
};

export const errorsManagerCodes: ErrorsManagerCodesStructure = {
  notFound: 404,
  generalErrorStatusCode: 500,
  registerErrorStatusCode: 409,
  wrongCredentialsStatusCode: 401,
};
