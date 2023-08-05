import { Ride } from "../../../database/models/Ride";

import { v2 as cloudinary } from "cloudinary";
import { type CustomRequest } from "./types/types";
import { type Response, type NextFunction } from "express";
import imageBackup from "./imageBackup";
/* eslint-disable @typescript-eslint/naming-convention */

jest.mock("cloudinary");

afterEach(async () => {
  jest.clearAllMocks();
});

const file: Partial<Express.Multer.File> = { filename: "test_image.jpg" };
const mockEvent = new Ride();

const req: Partial<CustomRequest> = {
  body: mockEvent,
  file: file as Express.Multer.File,
};
const res: Partial<Response> = {};

const next: NextFunction = jest.fn();

describe("imageBackup", () => {
  it("should upload the image to Cloudinary and update the request body", async () => {
    const mockCloudinaryUpload = jest.fn().mockResolvedValue({
      public_id: "test_image.jpg",
      secure_url: "https://mocked_cloudinary_url/test_image.jpg",
    });
    const mockCloudinaryUrl = jest
      .fn()
      .mockReturnValue("https://mocked_cloudinary_url/test_image.jpg");

    (cloudinary.uploader.upload as jest.MockedFunction<
      typeof cloudinary.uploader.upload
    >) = mockCloudinaryUpload;
    (cloudinary.url as jest.MockedFunction<typeof cloudinary.url>) =
      mockCloudinaryUrl;

    await imageBackup(req as CustomRequest, res as Response, next);

    expect(mockCloudinaryUpload).toHaveBeenCalledTimes(1);

    expect(mockCloudinaryUrl).toHaveBeenCalledTimes(1);
    expect(mockCloudinaryUrl).toHaveBeenCalledWith("test_image.jpg");

    expect(req.body.image).toBe("https://mocked_cloudinary_url/test_image.jpg");

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call the "next" function with an error if image upload fails', async () => {
    const mockCloudinaryUpload = jest
      .fn()
      .mockRejectedValue(new Error("Upload failed"));

    (cloudinary.uploader.upload as jest.MockedFunction<
      typeof cloudinary.uploader.upload
    >) = mockCloudinaryUpload;

    await imageBackup(req as CustomRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error("Failed to upload image"));
  });
});
