import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory, not disk
const upload = multer({ storage });

export default upload;
