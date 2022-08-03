const rutas = require('express').Router()


				//esta funcion deberia ir al controller
rutas.get('/',(req,res)=>{

	res.json({
		argumentos : process.argv.splice(2),
		plataforma : process.platform,
		versionNode : process.version,
		memoriatotal : process.memoryUsage().rss,
		rutaExect : process.execPath,
		IdProceso: process.pid,
		carpetaProyecto: process.cwd()
	})

})




module.exports = rutas