const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const debug = require('debug')('dejavu-server:conversations');

module.exports = {
    getConversations: (req, res, next) => {
        let {
            page = '1',
            limit = '12',
        } = req.query;
        page = Number.parseInt(page);
        limit = Number.parseInt(limit);
        if (isNaN(page) || isNaN(limit)) return next(createError(400));
        req.query.page = page;
        req.query.limit = limit;
        next();
    },
    checkConversation: (req, res, next) => {
        const { partnerId } = req.query;
        const schema = Joi.objectId().required();
        const { error } = schema.validate(partnerId);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    }
}