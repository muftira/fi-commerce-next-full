import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLODINARY,
  api_key: process.env.API_KEY_CLODINARY,
  api_secret: process.env.API_SECRET_CLODINARY,
});

export default cloudinary;