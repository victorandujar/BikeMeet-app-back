import {
  type PositiveFeedbackMessagesStructure,
  type PositiveFeedbackStatusCodesStructure,
} from "../types/types";

export const positiveFeedbackMessages: PositiveFeedbackMessagesStructure = {
  userCreatedMessage: "The user has been created!",
  verificationMailSuccess: "The user has been verified!",
  passwordChanged: "User password has been modified correctly!",
  userFound: "User found",
};

export const positiveFeedbackStatusCodes: PositiveFeedbackStatusCodesStructure =
  {
    responseOk: 200,
    created: 201,
  };
