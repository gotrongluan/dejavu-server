const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:gift-validator');

module.exports = {
    createGift: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required(),
            avatar: Joi.string().required(),
            pun: Joi.number().required(),
            coin: Joi.number().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    },
    sendGift: (req, res, next) => {
        const schema = Joi.object({
            giftId: Joi.objectId().required(),
            streamerId: Joi.objectId().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    }
}