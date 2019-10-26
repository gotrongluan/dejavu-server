const Joi = require('@hapi/joi');
const createError = require('http-errors');
const debug = require('debug')('dejavu-server:transactions');

module.exports = {
    transactions: (req, res, next) => {
        let {
            page = '1',
            limit = '12'
        } = req.query;
        page = Number.parseInt(page);
        limit = Number.parseInt(limit);
        if (isNaN(page) || isNaN(limit)) return next(createError(400));
        req.query.page = page;
        req.query.limit = limit;
        next();
    },
    buyCoin: (req, res, next) => {
        const schema = Joi.object({
            money: Joi.Number().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            debug(error.details[0].message);
            next(createError(400));
        }
        else next();
    }
}