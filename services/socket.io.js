const { getIO } = require('../socket-io');
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
    },
    sendGift: (name, avatar, streamerId, giftName, newPun) => {
        const room = `stream-${streamerId}`;
        const io = getIO();
        io.of('/stream').in(room).emit('message', {
            comment: `Sent to streamer a ${giftName.toUpperCase()} gift. Happy!`,
            name,
            avatar
        });
        io.of('/stream').in(room).emit('changePun', newPun);
    }
}