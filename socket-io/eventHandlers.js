function handlers(io) {
    io.on('connection', function (socket) {
        console.log('New socket connected!');
        socket.on('disconnect', function () {
            console.log('One socket has disconnected!');
        });
    });
    io.of('/chat').on('connection', function (socket) {
        console.log('New socket connected to chat namespace!');
        socket.on('disconnect', function () {
            console.log('One socket has disconnected chat namespace!');
        });

    });
    return io;
}

module.exports = handlers;