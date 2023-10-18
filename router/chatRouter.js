const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { chatCreate, chatSeenUpdate, imgUpload , videoUploadFunction} = require('../controlers/chatControlers');
const authorizationToken = require('../midelware/authorization');
const multer = require('multer');
const { upload, videoUpload } = require('../midelware/multer');





router.post('/', authorizationToken, chatCreate);
router.post('/img', authorizationToken, upload.single('image'), imgUpload);
router.post('/video', authorizationToken, videoUpload.single('video'), videoUploadFunction);

router.put('/seenBy', authorizationToken, chatSeenUpdate);



module.exports = router;





