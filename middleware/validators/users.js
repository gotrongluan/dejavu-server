const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:users-validator');

module.exports = {
    signup: (req, res, next) => {
        const schema = Joi.object({
            phone: Joi.string().pattern(/^\d{10}$/).required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            gender: Joi.string().required(),
            birthday: Joi.string().pattern(/^\d\d\/\d\d\/\d\d\d\d$/).required(),
            address: Joi.string(),
            avatar: Joi.string()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            next(createError(400));
        }
        else next();
    },
    login: (req, res, next) => {
        const schema = Joi.object({
            phone: Joi.string().pattern(/^\d{10}$/).required(),
            password: Joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            next(createError(400));
        }
        else next();
    }
}