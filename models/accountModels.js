const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    activeStatus: {
        type: Boolean,
    },
});

module.exports = accountSchema;

