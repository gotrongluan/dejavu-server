const { io } = require('../socket-io');
const { checkMemberInRoom } = require('../socket-io/chatRooms');

module.exports = {
    check: (converId, userId) => {
        const room = `chat-${converId}`;
        return checkMemberInRoom(room, userId);
    }
}