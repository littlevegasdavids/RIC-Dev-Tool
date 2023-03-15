require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const path = require('path');
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const logger = require('./helpers/logger')

var server = require('http').createServer(app).listen(port, function(){
   logger.info(`Live at: http://localhost:${port}`);
})

const io = require('socket.io')()
io.listen(server)
global.io = io
require('./helpers/socket')(io)

const { checkSession } = require('./middleware/session');
app.use(checkSession)

app.use(express.static('public'));

/*
app.get('*', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})
*/

app.get('/', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/queue', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/solved', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/error', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/login', (req, res)=>{
   return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

const jwt = require('jsonwebtoken')
const token_secrete = process.env.TOKEN_SECRETE

const app_password = process.env.APP_PASSWORD
app.post('/login', (req, res)=>{
   const password = req.body.password

   if(password != app_password){
      return res.json({success: false})
   }

   const authCookie = jwt.sign({}, token_secrete, {expiresIn: '7d'})
   res.cookie('authCookie', authCookie)
   return res.json({success: true})
})

app.post('/logout', (req, res)=>{
   res.clearCookie('authCookie')
   return res.redirect('/login')
})

const mountRoutes = require('./routes');
mountRoutes(app)