let rooms = {};

exports.addMember = (room, userId) => {
    rooms = {
        ...rooms,
        [room]: {
            ...rooms[room],
            [userId]: true,
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
    if (rooms[room]) return rooms[room][userId];
    return false;
}
