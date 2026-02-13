const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    console.log('Checking file type:', file.originalname, file.mimetype);
    const filetypes = /jpg|jpeg|png|webp|mp4|webm|mov|m4v/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    console.log('Ext check:', extname, 'Mime check:', mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        console.error('File type check failed for:', file.originalname);
        cb(new Error('Images and Videos only!'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', (req, res) => {
    console.log('Upload request received');
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        res.send({
            message: 'File uploaded',
            file: `/uploads/${req.file.filename}`,
            image: `/uploads/${req.file.filename}`, // Backward compatibility
        });
    });
});

module.exports = router;
