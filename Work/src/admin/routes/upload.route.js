import express from 'express';
const router = express.Router();
import { 
    createUpload, 
    getUploads, 
    getUploadById, 
    deleteUpload 
} from '../controller/Upload.controller.js';

router.post('/create', createUpload);
router.get('/all', getUploads);
router.get('/:id', getUploadById);
router.delete('/:id', deleteUpload);

export const uploadRoute = router;
