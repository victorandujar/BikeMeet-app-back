import {
  type ErrorsManagerCodesStructure,
  type ErrorsManagerMessagesStructure,
} from "./types/types";

export const errorsManagerMessages: ErrorsManagerMessagesStructure = {
  server: "Error on starting the server!",
  notFoundDev: "Path not found.",
  notFoundUser: "Endpoint not found.",
  publicMessageDefault: "Something went wrong!. Try again.",
};

export const errorsManagerCodes: ErrorsManagerCodesStructure = {
  notFound: 404,
  generalErrorStatusCode: 500,
};
