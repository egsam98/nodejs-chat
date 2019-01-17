const createError = require('http-errors');
const http = require('http');
const express = require('express');
const session = require("express-session");
// const redisStore = require("connect-redis")(session);
const sessionFileStore = require('session-file-store')(session);
const avatars = require('./avatars');
const sessionRouter = require('./routes/session');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

let clients = [];
clients.withoutSocket = function() {
    return clients.map(client => {
        let {socket, ...rest} = client;
        return rest
    })
};
clients.findById = function (id) {
    return clients.filter(client => {
        return client.id === id
    })[0];
};

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    if (typeof socket.handshake.query.conversationId !== 'undefined'){
        const conversationId = socket.handshake.query.conversationId;
        let userId = parseInt(conversationId.split('-')[0]);
        // console.log('ID', clients.findById(userId).id);
        // console.log('ROOMS', io.sockets.adapter.rooms);
        // console.log('ROOM convId length', io.sockets.adapter.rooms[conversationId].length);
        let partnerId = parseInt(conversationId.split('-')[1]);
        const room = io.sockets.adapter.rooms[conversationId];
        const partner = clients.findById(partnerId);
        if (!room || (room.length < 2)){
            socket.join(conversationId);
            partner.socket.emit('join', {
                data: {
                    id: conversationId.split('-')[0],
                    navName: socket.handshake.query.nickname
                }
            });
            // console.log(room);
        }
        io.to(conversationId).emit('established', {
            data: {},
            text: `Приватный чат с ${partner.nickname}`,
            type: 'info'
        });
        socket.on('message', (message) => {
            io.to(conversationId).emit('privateMessage', message);
        });
        socket.on('disconnect', () => {
            io.to(conversationId).emit('demolished', {
                data: {},
                text: `Пользователь ${socket.handshake.query.nickname} покинул чат`,
                type: 'info'
            })
        })
        console.log('private rooms', Object.keys(io.sockets.adapter.rooms).length)
    }
    else {
        let chatRoomName = 'chat room';
        socket.join(chatRoomName);
        if (clients.length === 0)
            socket.id = 1;
        else socket.id = clients[clients.length-1].id + 1;
        socket.nickname = socket.handshake.query.nickname;
        socket.avatar = avatars();
        let newUser = {
            id: socket.id,
            nickname: socket.nickname,
            avatar: socket.avatar
        };
        newUser.socket = socket;
        clients.push(newUser);
        socket.emit('cookiesReceived', {
            data: {
                id: newUser.id,
                avatar: newUser.avatar,
                nickname: newUser.nickname,
            }
        });
        io.to(chatRoomName).emit('userConnected', {
            data: {
                usersOnline: clients.withoutSocket()
            },
            text: `Пользователь ${newUser.nickname} подключился к чату`,
            type: 'info'
        });
        socket.on('message', (message) => {
            io.to(chatRoomName).emit('message', message);
        });
        socket.on('disconnect', () => {
            for (let i=0; i<clients.length; i++)
                if (clients[i].id === newUser.id){
                    clients.splice(i, 1);
                    break;
                }
            io.to(chatRoomName).emit('userDisconnected', {
                data: {
                    avatar: newUser.avatar,
                    nickname: newUser.nickname,
                    usersOnline: clients.withoutSocket()
                },
                text: 'Пользователь ' + newUser.nickname + ' покинул чат',
                type: 'info'
            })
        })
    }
});

server.listen(process.env.PORT || 5000);

