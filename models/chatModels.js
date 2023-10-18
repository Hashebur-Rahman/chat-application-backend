const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const chatShema = new mongoose.Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        required: true,
    },
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reciver: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'voice'],
        required: true,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    seenBy: [
        {
            type: mongoose.Types.ObjectId,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = chatShema;