const Follow = require('../models/follows');
const User = require('../models/users');
const _ = require('lodash');

module.exports = {
    getFollowers: async (userId, page, limit) => {
        try {
            let followers
                = await Follow.find({ followed: userId })
                    .populate('follower', 'name status avatar')
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .select(['follower']);
            followers = _.map(followers, f => f.follower);
            return { error: null, value: followers };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    getFollowings: async (userId, page, limit) => {
        try {
            let followings
                = await Follow.find({ follower: userId })
                    .populate('followed', 'name status avatar')
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .select(['followed']);
            followings = _.map(followings, f => f.followed);
            return { error: null, value: followings };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    follow: async (followedId, userId, userName, userAvatar) => {
        try {
            let pairs = await Follow.findOne({ follower: userId, followed: followedId });
            if (pairs) return { error: new Error('Already followed!'), value: null };
            pairs = new Follow({
                follower: userId,
                followed: followedId
            });
            await pairs.save();
            //save notification, type = 1
            const notification = {
                content: `${userName} has followed you. Have a fun relationship!`,
                seen: false,
                avatar: userAvatar,
                createdAt: Date.now(),
                type: 1
            };
            const followed =
                await User.findByIdAndUpdate(
                    followedId,
                    {
                        $push: {
                            notifications: notification
                        }
                    },
                    {
                        $new: true
                    }
                ).lean();
            const numOfUnread = _.filter(followed.notifications, notify => !notify.seen).length;
            //to firebase with numOfUnread

            return { error: null, value: 'Successfully!' };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    unfollow: async (followedId, userId, userName, userAvatar) => {
        try {
            const result = await Follow.deleteOne({ follower: userId, followed: followedId });
            if (result.deletedCount === 0)
                return { error: new Error('Not followed yet!'), value: null };
            const notification = {
                content: `${userName} has unfollowed you. Don't cry, Dejavu here!`,
                seen: false,
                avatar: userAvatar,
                createdAt: Date.now(),
                type: 2
            };
            const followed =
                await User.findByIdAndUpdate(
                    followedId,
                    {
                        $push: {
                            notifications: notification
                        }
                    },
                    {
                        $new: true
                    }
                ).lean();
            const numOfUnread = _.filter(followed.notifications, notify => !notify.seen).length;
            return { error: null, value: 'Successfully!' };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    getNumOfFollower: async userId => {
        try {
            const number = await Follow.find({ followed: userId }).count();
            return { error: null, value: number };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    getNumOfFollowing: async userId => {
        try {
            const number = await Follow.find({ follower: userId }).count();
            return { error: null, value: number };
        }
        catch (err) {
            return { error: err, value: null };
        }
    }
}