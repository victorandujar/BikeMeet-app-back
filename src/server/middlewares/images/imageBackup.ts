/* eslint-disable @typescript-eslint/naming-convention */
import "../../../loadEnvironment.js";
import { v2 as cloudinary } from "cloudinary";
import { type CustomRequest } from "./types/types";
import { type NextFunction, type Response } from "express";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageBackup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageName = req.file?.filename;

    const imagePath = path.join("uploads", imageName!);

    const transformationOptions = {
      width: 640,
      height: 400,
      crop: "fill",
      format: "webp",
      quality: 100,
      filename_override: imageName,
    };

    const image = await cloudinary.uploader.upload(
      imagePath,
      transformationOptions
    );

    const publicUrl = cloudinary.url(image.url, { secure: true });

    req.body.image = publicUrl;
    next();
  } catch (error) {
    const customError = new Error("Failed to upload image");

    next(customError);
  }
};

export default imageBackup;
