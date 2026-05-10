import { Upload } from "../models/Upload.model.js";

// @desc Create a new upload
// @route POST /api/v3/Admin/Upload/create
export const createUpload = async (req, res) => {
    try {
        const { title, description, category, fileUrl, uploadedBy } = req.body;

        if (!title || !category || !fileUrl || !uploadedBy) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required fields: title, category, fileUrl, uploadedBy" 
            });
        }

        const newUpload = await Upload.create({
            title,
            description,
            category,
            fileUrl,
            uploadedBy
        });

        return res.status(201).json({
            success: true,
            message: "Upload created successfully",
            data: newUpload
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc Get all uploads
// @route GET /api/v3/Admin/Upload/all
export const getUploads = async (req, res) => {
    try {
        const uploads = await Upload.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: uploads.length,
            data: uploads
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc Get upload by ID
// @route GET /api/v3/Admin/Upload/:id
export const getUploadById = async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ 
                success: false, 
                message: "Upload not found" 
            });
        }
        return res.status(200).json({
            success: true,
            data: upload
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc Delete upload
// @route DELETE /api/v3/Admin/Upload/:id
export const deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findByIdAndDelete(req.params.id);
        if (!upload) {
            return res.status(404).json({ 
                success: false, 
                message: "Upload not found" 
            });
        }
        return res.status(200).json({
            success: true,
            message: "Upload deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
