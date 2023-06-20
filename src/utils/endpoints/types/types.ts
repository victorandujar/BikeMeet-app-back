export interface UserEndpointsStructure {
  users: string;
  register: string;
  login: string;
  verifyEmail: string;
  getUser: string;
  recoveryPassword: string;
  resetPasswordEmail: string;
  restorePassword: string;
}

export interface RidesEndpointsStructure {
  rides: string;
  getAllRides: string;
  detail: string;
}
