const express = require('express');
const app = express()
const path = require('path')//pa' el la ruta
const server = require('http').createServer(app)//pa' el socket
const mongoose = require('mongoose')// pa' la base
const io = require('socket.io')(server)//pa' el chat
const {normalize,schema,denormalize} = require('normalizr')
//session y cookie y almacen
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoStore = require('connect-mongo') 
//instanciamos los chats 
const modelsChat = require('./models/modelsChat.js')
const DaoMongoChats = require('./dao/mongo')
const chats = new DaoMongoChats(modelsChat)

//inicialized de passport 
const initializePassport = require('./services/passport.config.js')
const passport = require('passport')
const routerPrincipal = require('./rutas/routerPrincipal.js')
const routerApi = require('./rutas/routerApi.js')
const routerInfo = require('./rutas/routerInfo.js')
//inicio dotenv
require('dotenv').config()

//dontenv variables
const PORT = process.argv[2] || 8080
const URI_MONGODB = process.env.URI_MONGODB
const URI_SESSIONDB = process.env.URI_SESSIONDB
const KEY = process.env.KEY
const SECRET_KEY = process.env.SECRET_KEY
//conectamos db
mongoose.connect(URI_MONGODB)
.then(e=>{
	console.log('todo oki')
})
.catch(e=>{
	console.log(e)
})


app.use(session({
	key:KEY,
	secret:SECRET_KEY,
	resave:false,
	saveUninitialized:false,
	store:mongoStore.create({
		mongoUrl:URI_SESSIONDB
	}),
	cookie:{maxAge:600000}
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
//aplicamos middleware 
app.use(cookieParser())

//iniciamos pasarela middleware passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/',routerPrincipal)
app.use('/api',routerApi)
app.use('/info',routerInfo)

//socket io
io.on('connection',async function(cliente){
	cliente.on('mensajeChat',async(data)=>{
		const chat = await chats.saveData(data)
		const resultNewChat = await chats.getAll()
		const resultChatComplete = await dataChat(resultNewChat)
		io.sockets.emit('mensajesChat',resultChatComplete)

	})
	//solo recargo data
	const resultNewChat = await chats.getAll()
	cliente.emit('mensajesChat',await dataChat(resultNewChat))
})

const dataChat = async(data)=>{
	// porque convierto y luego parseo, porque sino me crea un objeto/entidad 
	// con muchas funciones propias de mongo, de esta forma limpio los elementos
	const datastringy = JSON.stringify(data)
	const dataParse = JSON.parse(datastringy)
	
	//definimos las entidades y los esquemas
	const autor = new schema.Entity('autores',{},{idAttribute:'email'})
	const mensaje = new schema.Entity('mensajes',{autor:autor},{idAttribute:'_id'})
	const userListSchema = [mensaje]
	//normalizamos con la data
	const normalizedData = normalize(dataParse, userListSchema);

	//sacamos el tamaño de los datos
	const sinComprimir = datastringy.length
	const comprimido = JSON.stringify(normalizedData).length
	//agregamos el procentaje de compresion 
	normalizedData.comprimido = Math.floor(((sinComprimir/comprimido)-1)*100)
	return normalizedData
}



server.listen(PORT,()=>{
	console.log('todo oki')
})


























// const knex = require('knex')({
// 	client:'mysql',
// 	connection:{
// 		host:'127.0.0.1',
// 		user:'root',
// 		password:'root',
// 		database:'prueba'
// 	}
// })

// knex.schema.createTable('productos',table=>{
// 	// table.uuid('id').primary()
// 	table.string('nombre')
// 	table.string('codigo')
// 	table.float('precio')
// 	table.integer('stock')
// 	table.increments('id').primary()
// }).then(e=>{
// 	console.log('todo ok')
// }).catch(e=>{
// 	console.log('no se pudo',e)
// })

// knex('productos').insert([
// 	{
// 		nombre:'teclado',
// 		codigo:'baduw123Teclado',
// 		precio:123.20,
// 		stock:20
// 	},{
// 		nombre:'monitos',
// 		codigo:'baduw123Teclado',
// 		precio:123.20,
// 		stock:15
// 	},{
// 		nombre:'celular',
// 		codigo:'baduw123Teclado',
// 		precio:123.20,
// 		stock:30
// 	},{
// 		nombre:'platos',
// 		codigo:'baduw123Teclado',
// 		precio:123.20,
// 		stock:50
// 	},{
// 		nombre:'smartwatch',
// 		codigo:'baduw123Teclado',
// 		precio:123.20,
// 		stock:40
// 	}

// ]).then(e=>{
// 	console.log('todo ok')
// }).catch(e=>{
// 	console.log('todo mal',e)
// })


// knex('productos').select('nombre','codigo','precio')
// .then(e=>{
// 	console.log(e)
// }).catch(e=>{
// 	console.log('error')
// })

// knex('productos').where({id:'3'}).del().then(e=>{
// 	console.log('todo ok')
// }).catch(e=>{
// 	console.log('todo ok')
// })

// knex('productos').where({id:2}).update({stock:0})
// .then(e=>{
// 	console.log('todo oki')
// })
// .catch(e=>{
// 	console.log(e,'todo mal')
// })