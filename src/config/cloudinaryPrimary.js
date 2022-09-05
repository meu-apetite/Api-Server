import cloudinary from 'cloudinary';
import { config } from 'dotenv';
config();

const cloudinaryPrimary = () => {
  return {
    connect() {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY_PRIMARY,
        api_secret: process.env.CLOUDINARY_API_SECRET_PRIMARY,
      });
    },
  };
};

export default cloudinaryPrimary();
