export interface UserFeedbackStructure {
  userCreatedMessage: string;
}

export interface ErrorsManagerMessagesStructure {
  server: string;
  notFoundDev: string;
  notFoundUser: string;
  publicMessageDefault: string;
  registerPublicMessage: string;
}

export interface ErrorsManagerCodesStructure {
  notFound: number;
  generalErrorStatusCode: number;
  registerErrorStatusCode: number;
}
