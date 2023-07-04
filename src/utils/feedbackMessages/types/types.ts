export interface PositiveFeedbackMessagesStructure {
  userCreatedMessage: string;
  verificationMailSuccess: string;
  passwordChanged: string;
  userFound: string;
}

export interface UserErrorsManagerMessagesStructure {
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

export interface RidesErrorManagerMessagesStructure {
  notFoundRides: string;
  notFoundRide: string;
  notCreatedRide: string;
}

export interface ErrorsManagerCodesStructure {
  notFound: number;
  generalErrorStatusCode: number;
  registerErrorStatusCode: number;
  wrongCredentialsStatusCode: number;
}

export interface PositiveFeedbackStatusCodesStructure {
  responseOk: number;
  created: number;
}
