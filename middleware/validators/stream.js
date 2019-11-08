const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:stream-validator');

module.exports = {
    saveWowza: (req, res, next) => {
        const schema = Joi.object({
            wowza: Joi.object({
                primaryServer: Joi.string().required(),
                hostPort: Joi.number().required(),
                application: Joi.string().required(),
                streamName: Joi.string().required(),
                player_hls_playback_url: Joi.string().required(),
                streamId: Joi.string().required()
            }).required()
        }).required();
        const { error: errorWowza } = schema.validate(req.body);
        if (errorWowza) {
            debug(errorWowza.details[0].message);
            return next(createError(400));
        }
        next();
    }
}