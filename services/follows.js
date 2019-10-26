const Follow = require('../models/follows');
const _ = require('lodash');

module.exports = {
    getFollowers: async (userId, page, limit) => {
        try {
            let followers = await Follow.find({ followed: userId })
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
            let followings = await Follow.find({ follower: userId })
                                .populate('followed', 'name status avatar')
                                .skip((page - 1) * limit)
                                .limit(limit)
                                .select(['followed']);
            followings = _.map(followings, f => {
                if (!f.followed)
                    console.log(f);
                return f.followed;
            });
            return { error: null, value: followings };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    follow: async (followedId, userId) => {
        try {
            let pairs = await Follow.findOne({ follower: userId, followed: followedId });
            if (pairs) return { error: new Error('Already followed!'), value: null };
            pairs = new Follow({
                follower: userId,
                followed: followedId
            });
            pairs = await pairs.save();
            return { error: null, value: pairs };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    unfollow: async (followedId, userId) => {
        try {
            const pairs = await Follow.findOneAndDelete({ follower: userId, followed: followedId });
            return { error: null, value: pairs };
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