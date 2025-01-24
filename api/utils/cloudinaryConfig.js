import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { resolve } from "path";
import { Readable } from "stream";

// Load environment variables from .env file
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({resource_type:"auto"}, (error,result)=>{
      if (error) {
        console.error("Error during Cloudinary upload",error)
        reject(error)
      } else {
        console.log("Cloudinary upload successful", result)
        resolve(result)
      }
    })
    Readable.from(buffer).pipe(stream)
  })
}

export default uploadOnCloudinary;
