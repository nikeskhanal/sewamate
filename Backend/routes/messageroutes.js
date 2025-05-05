import express from 'express';
import multer from 'multer';
import { getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();
const upload = multer({ dest: '/uploads' });

router.post('/', upload.single('image'), sendMessage);

router.get('/:senderId/:receiverId', getMessages);


export default router;