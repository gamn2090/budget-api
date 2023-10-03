const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJwt } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({email})
        
        if(user)
        {
            return res.status(400).json({
                ok: false,
                mgs: "There's already an user with that email"
            })
        }
        user = new User( req.body );
        //encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        //generate JWT token
        const token = await generateJwt(user.id, user.name);
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
   
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
       
        let user = await User.findOne({email})
        
        if(!user)
        {
            return res.status(400).json({
                ok: false,
                mgs: "The user and password do not match"
            })
        }

        //confirm passwords
        const validPassword = bcrypt.compareSync(password, user.password)

        if(!validPassword){
            return res.status(400).json({
                "ok": false,
                "mgs": 'The user and password do not match'
            })
        }

        //generate JWT token
        const token = await generateJwt(user.id, user.name);

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
   
    
}

const renewToken = async (req, res = response) => {
    
    try {
        const { uid, name } = req.body;
        const token = await generateJwt(uid, name);

        res.status(200).json({
            ok: true,
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            "ok": false,
            "mgs": 'The token could not be renewed'
        })
    }    
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}