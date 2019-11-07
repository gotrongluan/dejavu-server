const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:vt-validator');

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
    }
}