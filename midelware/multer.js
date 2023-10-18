const multer = require('multer');
const path = require('path');





const fileFilter = (req, file, cb) => {
    //all img type file allowed

    const allowedFileTypes = /jpeg|jpg|png|gif|jfif|bmp|svg|webp|ico|tiff|jpeg2000|apng|heif|bat|raw|indd|ai|eps|pdf|psd|xcf|cdr|sketch/i;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG images are allowed.'));
    }
};

const videoFileFilter = (req, file, cb) => {
    const allowedFileTypes = /mp4|mkv|avi|flv|wmv/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only MP4, MKV, AVI, FLV, and WMV videos are allowed.'));
    }
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    //only support jpeg and png

    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },


});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const videoStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'videos/');
    },
    //only support jpeg and png

    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    limits: {
        // 100MB
        fileSize: 100 * 1024 * 1024,
    },
});




module.exports = { upload, videoUpload };