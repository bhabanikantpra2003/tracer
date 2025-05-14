import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
export default router;
import {
  getAllImages,
  deleteImage,
  fileUpload,
  extracttext,
  sendmessage,
} from '../controller/ImageController';
router.route('/').get(getAllImages);
router.route('/:id').delete(deleteImage);
router.post('/uploadFile', upload.single('file'), fileUpload);
router.post('/gettext', upload.single('filetobeused'), extracttext);
router.post('/sendtext', sendmessage);
