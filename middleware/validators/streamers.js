const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:users-validator');

module.exports = {
    getStreamer: (req, res, next) => {
        const { id: streamerId } = req.params;
        const schema = Joi.objectId().required();
        const { error } = schema.validate(streamerId);
        if (error) {
            debug(error.details[0].message);
            next(createError(400));
        }
        else next();
    },
    getStreamers: (req, res, next) => {
        let {
            page = '1',
            limit = '12',
            type,
        } = req.query;
        page = Number.parseInt(page);
        limit = Number.parseInt(limit);
        if (isNaN(page) || isNaN(limit)) return next(createError(400));
        req.query.page = page;
        req.query.limit = limit;
        const schema = Joi.string().valid('topPun', 'near', 'popular', 'mostView').required();
        const { error } = schema.validate(type);
        if (error) {
            debug(error.details[0].message);
            next(createError(400));
        }
        else next();
    }
}