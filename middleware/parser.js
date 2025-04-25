import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from 'multer'

// 1. Configure cloudinary to use our own accounts
// Provide the cloud_name, api_key and api_secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 2. Creates the storage object, that defines how and where our files are stored on cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'general_eye_uploads',
    format: 'png',
    public_id: (req, file) => {
      // Create unique name for the file to be uploaded with
      // Filename + current timestamp
      return Date.now() + '-' + file.originalname
    },
  },
})

// 3. Last part is the parser function that takes the image from a form and provides it to us on a req.file key
// This is used as middleware on any route with a file upload
const parser = multer({ storage: storage })

export default parser