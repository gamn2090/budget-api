const {response} = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {

    //error handler
    const errors = validationResult(req);

    if( !errors.isEmpty() ){
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        });
    }

    next();
}

module.exports = {
    validateFields
}
