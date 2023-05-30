import "../../loadEnvironment.js";
import { type UserRegisterCredentials } from "../../server/controllers/userControllers/types/types.js";
import endpoints from "../endpoints/endpoints.js";
import createMailTransporter, { user } from "./createMailTransporter.js";
import { type UserMailOptionsStructure } from "./types/types";

const sendVerificationEmail = async (userToVerify: UserRegisterCredentials) => {
  const transport = createMailTransporter();

  const mailOptions: UserMailOptionsStructure = {
    from: user!,
    to: userToVerify.email,
    subject: `Please ${userToVerify.name} confirm your email account`,
    html: `
    <div>
      <h1>BikeMeet email confirmation</h1>
      <h2>Hello ${userToVerify.name} 👋</h2>
      <p>Thank you for joining our cycling community 🚵🚵. Before you start sharing your rides, 
      please confirm your email by clicking on the following link ⬇️</p>
      <a href=${process.env.LOCALHOST!}${
      endpoints.verifyEmail
    }> Verify your email ✅</a>
    </div>
    `,
  };

  await transport.sendMail(mailOptions);
};

export default sendVerificationEmail;
