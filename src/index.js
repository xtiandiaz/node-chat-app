const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { 
    generateMessage,
    generateNotificationMessage,
    generateLocationMessage
} = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser, 
    getUsersInRoom
 } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, "../public")

app.use(express.static(publicDir))

io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit(
            'notification', 
            generateNotificationMessage(`Welcome ${user.username}!`))
        
        socket.broadcast.to(user.room).emit(
            'notification', 
            generateNotificationMessage(`${user.username} has joined.`))

        io.to(user.room).emit('roomUpdated', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        socket.on('message', (text, callback) => {
            const filter = new Filter()
    
            if (filter.isProfane(text)) {
                return callback('Profanity is not allowed!!!')
            }
            
            io.to(user.room).emit('message', generateMessage(user, text))
    
            callback('OK')
        })

        socket.on('location', ({latitude, longitude}, callback) => {
            io.to(user.room).emit('location', generateLocationMessage(user, { latitude, longitude }))
    
            callback('OK')
        })

        socket.on('disconnect', () => {
            if (!removeUser(socket.id))
             return

            io.to(user.room).emit('notification', generateNotificationMessage(`${user.username} has left the room.`))
            io.to(user.room).emit('roomUpdated', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        })

        callback()
    })
})

server.listen(port, () => {
    console.log('Server is live on port', port)
})