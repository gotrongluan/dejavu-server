const handlers = require('./eventHandlers');

let io = null;
let initilizeIO = server => {
    const io = require('socket.io')(server);
    io = handlers(io);
}

exports.initilizeIO = initilizeIO;
exports.io = io;