const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Hostar_Pro',
    allowedFormats: ["png", "jpg", "jpeg","avif", "mp4", "mov", "avi", "mkv"],
    resource_type: (req, file) => {
      if (file.mimetype.startsWith('video/')) {
        return 'video';
      } else {
        return 'image';
      }
    },
  },
});

module.exports = { cloudinary, storage };
