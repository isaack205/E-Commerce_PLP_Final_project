// Imports
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Your cloudinary config file

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'urban-spree-mart-uploads', // Optional folder name in Cloudinary
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;