const express = require('express');
const router = express.Router();
const accountSchema = require('../models/accountModels');
const chatListSchema = require('../models/chatListModels');
const chatSchema = require('../models/chatModels');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const deletePhoto = require('../midelware/deletPhoto');
const deleteVideo = require('../midelware/deleteVideo');

// Function to generate a unique message ID
function generateUniqueMessageId() {
    return new ObjectId();
}



const UserAccount = mongoose.model('UserAccount', accountSchema);
const ChatList = mongoose.model('ChatList', chatListSchema);
const Chat = mongoose.model('Chat', chatSchema);




const chatCreate = async (req, res) => {

    const messageId = await generateUniqueMessageId(); // You can implement this function

    // Create the chat message object with the generated ID
    const chatMessage = await {
        _id: messageId,
        sender: req.user.id,
        seenBy: [req.user.id],
        ...req.body,
    };
    // commit
    global.io.emit('newChatAdd', {
        chatInfo: chatMessage,
    });
    global.io.emit('newChatAdd2', {
        chatInfo: chatMessage,
    });

    const findChatList = await ChatList.findById(req.body.chatId);

    try {

        if (await findChatList.createUser == req.user.id || await findChatList.participent.includes(req.user.id)) {


            // console.log(chatMessage);




            const chat = await new Chat(chatMessage);
            const result = await chat.save();

            findChatList.lastMessage = await result._id;
            findChatList.updatedAt = await Date.now();
            await findChatList.save();

            res.send({ message: 'Chat created successfully', success: true, chatInfo: result });
        }
        else {
            res.send({ message: 'you are no authorized to create chat', success: false });
        }


    } catch (error) {
        console.log(error);
        res.send({ message: 'Chat not create', success: false });
    }
}

const imgUpload = async (req, res) => {
    const fileName = req.file?.filename;
    const body = JSON.parse(req.body.jsonData);

    const findChatList = await ChatList.findById(body.chatId);

    try {

        if (await findChatList.createUser == req.user.id || await findChatList.participent.includes(req.user.id)) {

            const messageId = await generateUniqueMessageId(); // You can implement this function

            // Create the chat message object with the generated ID
            const chatMessage = await {
                _id: messageId,
                image: fileName,
                sender: req.user.id,
                seenBy: [req.user.id],
                ...body,
            };

            // console.log(chatMessage);


            global.io.emit('newChatAdd', {
                chatInfo: chatMessage,
            });
            global.io.emit('newChatAdd2', {
                chatInfo: chatMessage,
            });

            const chat = await new Chat(chatMessage);
            const result = await chat.save();

            findChatList.lastMessage = await result._id;
            findChatList.updatedAt = await Date.now();
            await findChatList.save();

            res.send({ message: 'Chat created successfully', success: true, chatInfo: result });
        }
        else {
            deletePhoto(fileName);
            res.send({ message: 'you are no authorized to create chat', success: false });
        }


    } catch (error) {
        console.log(error);
        deletePhoto(fileName);
        res.send({ message: 'Chat not create', success: false });
    }
}


const videoUploadFunction = async (req, res) => {
    const fileName = req.file?.filename;
    const body = JSON.parse(req.body.jsonData);

    const findChatList = await ChatList.findById(body.chatId);
    console.log(fileName, body);

    try {

        if (await findChatList.createUser == req.user.id || await findChatList.participent.includes(req.user.id)) {

            const messageId = await generateUniqueMessageId(); // You can implement this function

            // Create the chat message object with the generated ID
            const chatMessage = await {
                _id: messageId,
                video: fileName,
                sender: req.user.id,
                seenBy: [req.user.id],
                ...body,
            };

            // console.log(chatMessage);


            global.io.emit('newChatAdd', {
                chatInfo: chatMessage,
            });
            global.io.emit('newChatAdd2', {
                chatInfo: chatMessage,
            });

            const chat = await new Chat(chatMessage);
            const result = await chat.save();

            findChatList.lastMessage = await result._id;
            findChatList.updatedAt = await Date.now();
            await findChatList.save();

            res.send({ message: 'Chat created successfully', success: true, chatInfo: result });
        }
        else {
            deleteVideo(fileName);
            res.send({ message: 'you are no authorized to create chat', success: false });
        }


    } catch (error) {
        console.log(error);
        deleteVideo(fileName);
        res.send({ message: 'Chat not create', success: false });
    }
}




const chatSeenUpdate = async (req, res) => {
    const unSeenId = req.body.unSeenId;
    const upDateSeen = await Chat.updateMany({ _id: { $in: unSeenId } }, { $push: { seenBy: req.user.id } });
    res.send({ message: 'Chat seen updated', success: true });
}



module.exports = { chatCreate, chatSeenUpdate, imgUpload, videoUploadFunction }