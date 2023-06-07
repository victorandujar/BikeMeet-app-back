import { type EndpointsStructure } from "./types/types";

const endpoints: EndpointsStructure = {
  users: "/users",
  register: "/register",
  login: "/login",
  verifyEmail: "/verify-email",
  getUser: "/user-verify",
  recoveryPassword: "/restore-password/:userId",
  resetPasswordEmail: "/recovery-password",
  restorePassword: "/restore-password",
};

export default endpoints;
