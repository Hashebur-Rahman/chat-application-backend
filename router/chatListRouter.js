const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { chatListPost, getAllChatLIst, searchUser, getAllChat, createGroup, groupUserRemove, groupUserAdd, deleteChatList } = require('../controlers/chatListControler');
const authorizationToken = require('../midelware/authorization');
const { upload } = require('../midelware/multer');



router.get('/', authorizationToken, getAllChatLIst);

router.get('/search/:text', authorizationToken, searchUser);

router.post('/', authorizationToken, chatListPost);
router.post('/group', authorizationToken, upload.single('image'), createGroup);

router.put('/groupUserRemove', authorizationToken, groupUserRemove);
router.put('/groupUserAdd', authorizationToken, groupUserAdd);



router.get('/chat/:id', authorizationToken, getAllChat);

router.put('/:id', (req, res) => { });

router.delete('/:id', authorizationToken, deleteChatList);




module.exports = router;