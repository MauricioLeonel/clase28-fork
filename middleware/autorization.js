require('dotenv').config()

const KEY = process.env.KEY

const autorizationUser = (req,res,next)=>{
	console.log(req.session.username)
	if(req.session.username && req.cookies.KEY){
		 res.redirect('/principal')
	}else{
		next()

	}
}

module.exports = autorizationUser