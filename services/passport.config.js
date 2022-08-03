const passport = require('passport')
const local = require('passport-local')


const ModelsUser = require('../models/modelsUser.js')
const DaoMongo = require('../dao/mongo')

const usersAll = new DaoMongo(ModelsUser)



const localStrategy =local.Strategy

const initializePassport = ()=>{
	passport.use(
		'register',
		new localStrategy(
			// {passReqToCallback:true},
			async(username,password,done)=>{
				try{
					const user = await usersAll.getByEmail(username)
					if(user) return done(null,false)
		
					try{
						const result = await usersAll.saveData({email:username,password:password})
						return done(null,result)
					}catch(e){
						return done(null,e)
					}
				}catch(e){
					return done(null,e)
				}
			}

		)
	)
	passport.use(
		'login',
		new localStrategy(
			async(username,password,done)=>{
				console.log(username,password)
				try{
					const user = await usersAll.getByEmail(username)
					if(user && user.isValidatePassword(password,user.password)){
						return done(null,user)
					}else{
						return done(null,false,{message:'usuario o contraseña incorrecta'})
					}

				}catch(e){
					return done(null,e)
				}
			}
		)
	)
	passport.serializeUser((user,done)=>{
		done(null,user._id)
	})

	passport.deserializeUser((id,done)=>{
		// console.log(id)
		const user = usersAll.getById(id,done)
		done(null,user)
	})
}

module.exports = initializePassport


