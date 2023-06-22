export interface UserEndpointsStructure {
  users: string;
  register: string;
  login: string;
  verifyEmail: string;
  userToVerify: string;
  recoveryPassword: string;
  resetPasswordEmail: string;
  restorePassword: string;
  getUser: string;
}

export interface RidesEndpointsStructure {
  rides: string;
  getAllRides: string;
}
