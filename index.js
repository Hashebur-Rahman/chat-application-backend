const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const accoutRouter = require('./router/accountRouter');
const chatListRouter = require('./router/chatListRouter');
const chatRouter = require('./router/chatRouter');
const multer = require('multer');
const http = require('http');

dotenv.config();



mongoose.connect('mongodb://127.0.0.1:27017/ChatApplication', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅✅ Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});


// all route
app.use('/account', accoutRouter);
app.use('/chatlist', chatListRouter);
app.use('/chat', chatRouter);
app.use('/uploads', express.static('uploads'));
app.use('/videos', express.static('videos'));
app.use('/chatFiles', express.static('chatFiles'));

//multer error handelaer
let errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.send({ message: err.message, success: false });
    } else {
        res.send({ message: err.message, success: false });
    }
};


app.use(errorHandler);

const server = app.listen(port)
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected on socket`);
    socket.on('seenByOn', (data) => {
        io.emit('seenBy', data);
        io.emit('seenBy2', data);
    });

    socket.on('typingOn', (data) => {
        io.emit('typing_start', data);
    });
    socket.on('typingOf', (data) => {
        io.emit('typing_end', data);
    });

});

global.io = io;