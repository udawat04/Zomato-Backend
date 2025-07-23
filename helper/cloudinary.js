const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.uploadImage = async (files) => {
  const fileArray = Array.isArray(files.images) ? files.images : [files.images]; // Safely extract array of files from `images` key

  const results = []; // This will store the result of each upload

  // Upload each file one by one
  for (const file of fileArray) {
    try {
      const result = await new Promise((resolve, reject) => {
        // Upload the file to Cloudinary
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) {
              console.error("❌ Upload Error:", error);
              reject(error);
            } else {
              console.log("✅ Upload Success:", result.secure_url);
              resolve(result);
            }
          })
          .end(file.data); // Start uploading the file
      });

      results.push(result);
    } catch (error) {
      console.error("Error uploading file:", error); // Log the error if upload fails
    }
  }

  return results; // Return the list of upload results
};
