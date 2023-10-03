/*    
    user routes  / Auth
    host + /api/auth
*/

// const express = require('express');
// const router = express.router;

//it can also be:
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { validateJwt } = require('../middlewares/validate-jwt');
const { createUser,
    loginUser, 
    renewToken } = require('../controllers/auth');

const router = Router();

router.post(
        '/register', 
        [
            //middloewares
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'the email field is required and must be a valid email address').isEmail(),
            check('password', 'Password must have 6 characters long').isLength({min: 6}),
            validateFields,
        ], 
        createUser
)

router.post(
        '/',
        [
            //middloewares            
            check('email', 'the email field is required and must be a valid email address').isEmail(),
            check('password', 'Password must have 6 characters long').isLength({min: 6}),
            validateFields,
        ], 
        loginUser
)

router.get('/renew', validateJwt, renewToken)

module.exports = router;