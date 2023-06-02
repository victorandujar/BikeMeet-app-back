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
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px">
      <h1 style="font-weight: 900; font-family: Arial; font-size: 25px">BikeMeet email confirmation</h1>
      <h2 style="font-family: Arial">Hello ${userToVerify.name} 👋</h2>
      <p style="font-size: 15px; font-family: Arial">Thank you for joining our cycling community 🚵🚵. 
      Before you start sharing your rides, please confirm your email by clicking on the following link ⬇️</p>
      <button style="background: #0f7bff; font-family: Arial; font-weight: 700; border-radius: 10px; height: 40px; font-size: 15px; width: 160px; border: none"><a href=${process
        .env.LOCALHOST!}${
      endpoints.verifyEmail
    }/${userToVerify.confirmationCode!} style="text-decoration: none; color: #fff;">Verify your email</a></button>
  </div>
    `,
  };

  await transport.sendMail(mailOptions);
};

export default sendVerificationEmail;
