export interface UserFeedbackStructure {
  userCreatedMessage: string;
  verificationMailSuccess: string;
  passwordChanged: string;
  userFound: string;
}

export interface ErrorsManagerMessagesStructure {
  server: string;
  notFoundDev: string;
  notFoundUser: string;
  publicMessageDefault: string;
  registerPublicMessage: string;
  wrongCredentialsMessage: string;
  verificationMailError: string;
  getUserWrongEmail: string;
  passwordRecoveryError: string;
}

export interface ErrorsManagerCodesStructure {
  notFound: number;
  generalErrorStatusCode: number;
  registerErrorStatusCode: number;
  wrongCredentialsStatusCode: number;
}

export interface UsersPositiveStatusCodesStructure {
  responseOk: number;
  created: number;
}
