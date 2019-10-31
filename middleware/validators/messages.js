const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const debug = require('debug')('dejavu-server:messages');

module.exports = {
    send: (req, res, next) => {
        const schema = Joi.object({
            text: Joi.string().required(),
            converId: Joi.objectId().required(),
            partnerId: Joi.objectId().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            return next(createError(400));
        }
        next();
    }
}