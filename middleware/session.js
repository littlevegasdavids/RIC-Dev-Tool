require('dotenv').config()
const jwt = require('jsonwebtoken')
const token_secrete = process.env.TOKEN_SECRETE
const skipCheck = ['/global.css', '/build/bundle.css', '/build/bundle.js', '/login', '/logout']

async function checkSession(req, res, next){
    if(!skipCheck.includes(req.path)){ 
        const authCookie = req.cookies.authCookie
        if(authCookie === undefined){
            return res.redirect('/login')
        }
        
        jwt.verify(authCookie, token_secrete, (err, data)=>{
            if(err){
                res.clearCookie('authCookie')
                return res.redirect('/login')
            }
        })
    }
    next()
}


module.exports = {checkSession}