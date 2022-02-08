
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { sendMessageToDatabase, addUserToChat, clearChat, editUserName, logoutUser, loginUser, modifyProfilePic, modifyName, setTheme, sendMessageToMe } = require('./functions')
const server = http.createServer(app)
app.use(cors())

const PORT = process.env.PORT || 5000

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

let activeUsers = []

io.on('connection', (socket) => {

    socket.on('user_connected', (data) => {
        loginUser(data, activeUsers, socket)
    })

    socket.on('join_room', (roomName) => {
        socket.join(roomName);
    })

    socket.on('user_typing', (data) => {
        socket.to(data.room).emit('active_user_typing', data)
    })

    socket.on('user_stopped_typing', (data) => {
        socket.to(data.room).emit('active_user_stopped_typing', data)
    })

    socket.on('send_message', (messageData) => {
        sendMessageToDatabase(messageData)
    })

    socket.on('add_user_to_chat', (data) => {
        addUserToChat(data.user, data.name, data.targetUser, socket)
    })

    socket.on('clear_chat', (data) => {
        clearChat(data.user, data.targetUser, socket)
    })
    socket.on('edit_user_name', (data) => {
        editUserName(data, socket)
    })
    socket.on('logout_user', (data) => {
        logoutUser(activeUsers, socket, data)
    })
    socket.on('modify_profilePic', (data) => {
        modifyProfilePic(data.user, data.photoURL, socket)
    })
    socket.on('modify_name', (data) => {
        modifyName(data.user, data.editedName, socket)

    })
    socket.on('setTheme', (data) => {
        setTheme(data.user, data.link, socket)
    })
    socket.on('sendMessageToMe', (data) => {
        sendMessageToMe(data.email, data.message, socket)
    })

    socket.on('disconnect', () => {
        logoutUser(activeUsers, socket)
    })

})





server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})
