import {
  type UserFeedbackStructure,
  type UsersPositiveStatusCodesStructure,
} from "../types/types";

export const userPositiveFeedback: UserFeedbackStructure = {
  userCreatedMessage: "The user has been created!",
  verificationMailSuccess: "The user has been verified!",
  passwordChanged: "User password has been modified correctly!",
};

export const usersPositiveStatusCodes: UsersPositiveStatusCodesStructure = {
  responseOk: 200,
  created: 201,
};
