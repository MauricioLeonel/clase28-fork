const rutas = require('express').Router()
const autorizationUser = require('../middleware/autorization.js')
const passport = require('passport')
const path = require('path')
require('dotenv').config()

const KEY = process.env.KEY

rutas.get('/',(req,res)=>{
	// console.log(__dirname)
	res.redirect('/principal')
})

rutas.get('/principal',(req,res)=>{
	console.log(KEY)
	if(req.session.username && req.cookies[KEY] ){

		res.sendFile(path.join(__dirname,'../public/principal.html'))
	}else{
		res.redirect('/login')
	}
})

rutas.get('/login',autorizationUser,(req,res)=>{
	res.sendFile(path.join(__dirname,'../public/login.html'))
})
rutas.get('/register',autorizationUser,(req,res)=>{
	res.sendFile(path.join(__dirname,'../public/register.html'))
})

rutas.post('/logout',(req,res)=>{
	req.session.destroy(e=>{
		if(e){
			return res.send('hubo un error')
		}
	})
	res.sendFile(path.join(__dirname,'../public/logout.html'))
})

rutas.post('/register',passport.authenticate('register',{failureRedirect:'/failedRegister'}),(req,res)=>{
	res.redirect('/login')
})
rutas.get('/failedRegister',(req,res)=>{
	res.sendFile(path.join(__dirname,'../public/failregister.html'))
})
rutas.post('/login',passport.authenticate('login',{failureRedirect:'/failedLogin'}),(req,res)=>{
	req.session.username = req.body.username
	res.cookie('username',req.session.username).redirect('/principal')
})
rutas.get('/failedLogin',(req,res)=>{
	res.sendFile(path.join(__dirname,'../public/faillogin.html'))
})




module.exports = rutas
