const { io } = require('../socket-io');
const { checkMemberInRoom, emit } = require('../socket-io/chatRooms');

module.exports = {
    check: (converId, userId) => {
        const room = `chat-${converId}`;
        return checkMemberInRoom(room, userId);
    },
    sendMessage: (converId, userId, message) => {
        const room = `chat-${converId}`;
        emit(room, userId, 'message', message);
    },
    sendSeenStatus: (converId, userId, messageIds) => {
        const room = `chat-${converId}`;
        emit(room, userId, 'seen', messageIds);
    }
}