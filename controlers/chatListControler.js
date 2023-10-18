const mongoose = require('mongoose');

const chatListSchema = require('../models/chatListModels');
const accountSchema = require('../models/accountModels');
const chatSchema = require('../models/chatModels');

const UserAccount = mongoose.model('UserAccount', accountSchema);
const ChatList = mongoose.model('ChatList', chatListSchema);
const Chat = mongoose.model('Chat', chatSchema);
const deletePhoto = require('../midelware/deletPhoto');
const deleteVideo = require('../midelware/deleteVideo');


const chatListPost = async (req, res) => {
    try {
        const chatList = new ChatList({
            createUser: req.user.id,
            participent: req.body.participent,
            chatType: req.body.chatType,
        });

        if (req.body.chatType == 'private') {
            const check = await ChatList.findOne({ $and: [{ createUser: req.user.id, chatType: 'private' }, { participent: { $in: req.body.participent }, chatType: 'private' }] });
            const check2 = await ChatList.findOne({ $and: [{ participent: { $in: [req.user.id] }, chatType: 'private' }, { createUser: { $in: req.body.participent }, chatType: 'private' }] });

            if (check || check2) {
                res.send({ message: 'Chat already created', success: true, chatInfo: check || check2 });
                return;
            }
        }


        const result = await chatList.save();
        const chatLIst = await ChatList.findById(result._id).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage');

        await global.io.emit('newChatListCreate', { chatInfo: chatLIst });

        res.send({ message: 'Chat created successfully', success: true, chatInfo: result });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat created failed', success: false });

    }
}


const createGroup = async (req, res) => {
    const fileName = req.file?.filename;
    const body = JSON.parse(req.body.jsonData);
    try {
        const createGrp = new ChatList({
            createUser: req.user.id,
            participent: body.participent,
            chatType: 'group',
            groupName: body.groupName,
            groupImg: fileName,
        });
        const result = await createGrp.save();
        const chatLIst = await ChatList.findById(result._id).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage');
        await global.io.emit('newChatListCreate', { chatInfo: chatLIst });
        res.send({ message: 'Group created successfully', success: true, chatInfo: chatLIst });
    } catch (error) {
        console.log(error);
        res.send({ message: 'Group created failed', success: false });
    }
}

const groupUserRemove = async (req, res) => {
    const body = req.body;
    try {
        const findChatList = await ChatList.findById(body.chatId);
        if (findChatList.createUser == req.user.id) {
            const updateChatList = await ChatList.findByIdAndUpdate(body.chatId, { $pull: { participent: body.userId } }, { new: true }).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage');
            await global.io.emit('group User Remove2', body);
            await global.io.emit('group User Remove', body);
            res.send({ message: 'User removed successfully', success: true, chatInfo: updateChatList });
        }
        else {
            res.send({ message: 'you are no authorized to remove user', success: false });
        }
    } catch (error) {
        console.log(error);
        res.send({ message: 'User removed failed', success: false });
    }
}


const groupUserAdd = async (req, res) => {
    const body = req.body;
    const newUserId = body.newUser.map(n => n._id);
    try {
        const findChatList = await ChatList.findById(body.chatId);

        if (findChatList.createUser == req.user.id) {
            const updateChatList = await ChatList.findByIdAndUpdate(body.chatId,
                { $push: { participent: { $each: newUserId } } },
                { new: true, })
                .populate('createUser', '-password')
                .populate('participent', '-password')
                .populate('lastMessage');

            await global.io.emit('grp New User Add', {
                chatInfo: updateChatList,
                chatId: body.chatId,
                newUserId: newUserId
            });

            res.send({ message: 'User added successfully', success: true, chatInfo: updateChatList });
        }
        else {
            res.send({ message: 'you are no authorized to add user', success: false });
        }
    } catch (error) {
        console.log(error);
        res.send({ message: 'User added failed', success: false });
    }
}


const deleteChatList = async (req, res) => {
    try {
        const findAllChat = await Chat.find({ chatId: req.params.id });

        const allImg = await findAllChat.map(chat => chat?.image);
        const allVideo = await findAllChat.map(chat => chat?.video);


        await allImg.map(img => {
            if (img) {
                deletePhoto(img);
            }
        });

        await allVideo.map(video => {
            if (video) {
                deleteVideo(video);
            }
        })

        const deleteChatList = await ChatList.findByIdAndDelete(req.params.id);
        const deleteChat = await Chat.deleteMany({ chatId: req.params.id });

        await global.io.emit('chat Delete', { chatId: req.params.id });
        await global.io.emit('chat Delete2', { chatId: req.params.id });

        res.send({ message: 'Chat deleted successfully', success: true });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat deleted failed', success: false });

    }
}


const getAllChatLIst = async (req, res) => {
    try {
        const chatList = await ChatList.find({ $or: [{ createUser: req.user.id }, { participent: { $in: req.user.id } }] }).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage').sort({ updatedAt: -1 });

        res.send({ message: 'Chat list found', success: true, chatList: chatList });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat list not found', success: false });

    }
}



const searchUser = async (req, res) => {
    const text = req.params.text;
    const userList = await UserAccount.find({
        $or: [
            { name: { $regex: text, $options: "i" } },
            { email: { $regex: text, $options: "i" } }
        ]
    }).select('-password')

    res.send({ message: 'User list found', success: true, userList: userList });

}




const getAllChat = async (req, res) => {
    try {
        const findChatList = await ChatList.findById(req.params.id).populate('createUser', '-password').populate('participent', '-password');


        if (await findChatList?.createUser?._id == req.user.id || await findChatList.participent.find(parti => parti._id == req.user.id)) {

            const chat = await Chat.find({ chatId: req.params.id }).sort({ createdAt: -1 }).skip(+req?.query?.skip).limit(15)
            const dateSort = chat.sort((a, b) => a.createdAt - b.createdAt)

            res.send({
                message: 'Chat found',
                chatType: findChatList.chatType,
                groupName: findChatList?.groupName,
                groupImg: findChatList?.groupImg,
                chatId: req.params.id,
                createUserDetails: findChatList.createUser,
                participentDetails: findChatList.participent,
                success: true,
                chat: dateSort
            });
        }
        else {
            res.send({ message: 'you are no authorized to get chat', success: false });
        }

    } catch (error) {
        res.send({ message: 'Chat not found', success: false });
    }
}

module.exports = { chatListPost, getAllChatLIst, searchUser, getAllChat, createGroup, groupUserRemove, groupUserAdd, deleteChatList }