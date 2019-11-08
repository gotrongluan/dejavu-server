const handlers = require('./eventHandlers');

let io = null;
let initializeIO = server => {
    io = require('socket.io').listen(server);
    //io.origins(['http://localhost:3000']);
    io = handlers(io);
}

exports.initializeIO = initializeIO;
exports.getIO = () => {
    return io;
}