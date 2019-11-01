let rooms = {};

exports.addMember = (room, userId, socket) => {
    rooms = {
        ...rooms,
        [room]: {
            ...rooms[room],
            [userId]: socket,
        }
    };
}

exports.removeMember = (room, userId) => {
    rooms = {
        ...rooms,
        [room]: {
            ...rooms[room],
            [userId]: false
        }
    };
}

exports.checkMemberInRoom = (room, userId) => {
    if (rooms[room]) return !!rooms[room][userId];
    return false;
}

exports.emit = (room, userId, type, data) => {
    if (rooms[room] && rooms[room][userId]) {
        const socket = rooms[room][userId];
        socket.emit(type, data);
    };
    return false;
};
