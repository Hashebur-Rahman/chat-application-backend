const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');




const chatListSchema = new mongoose.Schema({

    createUser: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserAccount',
    },
    participent: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'UserAccount',
        }
    ],
    chatType: {
        type: String,
        required: true,
        enum: ['private', 'group'],
    },
    groupName: {
        type: String,
    },
    groupImg: {
        type: String,
    },
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: 'Chat',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});


module.exports = chatListSchema;