import { type EndpointsStructure } from "./types/types";

const endpoints: EndpointsStructure = {
  users: "/users",
  register: "/register",
  login: "/login",
  verifyEmail: "/verify-email",
  getUser: "/user-verify",
  recoveryPassword: "/recovery-password/:userId",
};

export default endpoints;
