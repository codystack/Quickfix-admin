/* eslint-disable import/no-extraneous-dependencies */
import imageCompression from "browser-image-compression";

async function compressImage(file: any) {
    const options = {
      maxSizeMB: 0.1, // Target size in MB
      maxWidthOrHeight: 1024, // Maximum dimension (width/height) in pixels
    };
    return imageCompression(file, options);
  }