import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import path from "path";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

const router = express.Router();

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter for allowed image types (jpg, png, webp)
const fileFilter = (req, file, cb) => {
  console.log("File received:", file.originalname); // Log file name for debugging

  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  console.log("File extension:", extname); // Log file extension
  console.log("File mimetype:", mimetype); // Log file mimetype

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image"); // 'image' is the field name in your form

router.post("/", (req, res) => {
  console.log("POST request received at / endpoint"); // Log the request to ensure the endpoint is hit

  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.error("Error during file upload:", err.message); // Log the error message
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      console.warn("No image file provided"); // Log a warning if no file is provided
      return res.status(400).send({ message: "No image file provided" });
    }

    console.log("Image file successfully uploaded:", req.file.originalname); // Log successful file upload

    // Upload image to Cloudinary
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'image', // Uploading an image
        public_id: `image-${Date.now()}`, // Optional: You can set a custom public_id for Cloudinary
      },
      (cloudinaryError, result) => {
        if (cloudinaryError) {
          console.error("Cloudinary upload error:", cloudinaryError.message); // Log Cloudinary upload error
          return res.status(500).send({ message: "Error uploading to Cloudinary", error: cloudinaryError.message });
        }

        // On successful upload, return the Cloudinary image URL
        console.log("Cloudinary upload successful:", result.secure_url); // Log Cloudinary image URL
        res.status(200).send({
          message: "Image uploaded successfully",
          image: result.secure_url, // Cloudinary URL for the uploaded image
        });
      }
    );

    // Stream the file buffer to Cloudinary
    console.log("Streaming image buffer to Cloudinary..."); // Log streaming info
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
});

export default router;
