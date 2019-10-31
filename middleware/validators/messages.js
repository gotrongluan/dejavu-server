const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:messages');

module.exports = {
    send: (req, res, next) => {
        const schema = Joi.object({
            text: Joi.string().required(),
            conversationId: Joi.objectId().required().allow(null),
            partnerId: Joi.objectId().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    },
    getMessages: (req, res, next) => {
        let {
            page = '1',
            limit = '12',
            converId,
        } = req.query;
        page = Number.parseInt(page);
        limit = Number.parseInt(limit);
        if (isNaN(page) || isNaN(limit)) return next(createError(400));
        req.query.page = page;
        req.query.limit = limit;
        const schema = Joi.objectId().required();
        const { error } = schema.validate(converId);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    }
}