const { addMember, removeMember } = require('./chatRooms');

function handlers(io) {
    io.on('connection', function (socket) {
        console.log('New socket connected!');
        socket.on('disconnect', function () {
            console.log('One socket has disconnected!');
        });
    });
    io.of('/chat').on('connection', function (socket) {
        console.log('New socket connected to chat namespace!');
        socket.on('joinConversation', function (converId, userId) {
            const room = `chat-${converId}`;
            addMember(room, userId, socket);;
        });
        socket.on('leaveConversation', function (converId, userId) {
            const room = `chat-${converId}`;
            removeMember(room, userId);
        });

        socket.on('disconnect', function () {
            console.log('One socket has disconnected chat namespace!');
        });

    });
    io.of('/stream').on('connection', function (socket) {
        console.log('New socket connected to stream namespace!');
        socket.on('joinRoom', function (streamerId) {
            socket.join(`stream-${streamerId}`);
        });
        socket.on('leaveRoom', function (streamerId, userId) {
            if (streamerId === userId && streamerId) {
                socket.to(`stream-${streamerId}`).emit('close');
                io.of('/stream').in(`stream-${streamerId}`).clients((error, socketIds) => {
                    if (error) throw error;
                    socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(`stream-${streamerId}`));
                  
                });
            }
            else socket.leave(`stream-${streamerId}`);
        });
        socket.on('message', function (streamerId, message) {
            io.of('/stream').to(`stream-${streamerId}`).emit('message', message);
        });
    })
    return io;
}

module.exports = handlers;