const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const notificationSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const userSchema = new Schema({
    phone: {
        type: String,
        match: /^\d{10}$/,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    birthday: {
        type: String,
        match: /^\d\d\/\d\d\/\d\d\d\d$/,
        required: true
    },
    address: {
        type: String
    },
    avatar: {
        type: String,
        default: 'https://farm66.static.flickr.com/65535/48168117221_319c6f7081_b.jpg'
    },
    coin: {
        type: Number,
        default: 0
    },
    pun: {
        type: Number,
        default: 0
    },
    online: {
        type: Boolean,
        default: false
    },
    notifications: [ notificationSchema ]
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'phone',
    usernameUnique: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;
