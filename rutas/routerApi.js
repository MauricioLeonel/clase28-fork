const rutas = require('express').Router()
const {faker} = require('@faker-js/faker')
const {fork} = require('child_process')

rutas.get('/productos-test',(req,res)=>{
	const productos = []
	for(var i = 0; i < 5; i++){
		const result = {
			nombre:faker.commerce.product(),
			precio:faker.commerce.price(),
			foto:faker.image.technics()
		}
		productos.push(result)
	}
	res.send(productos)
})


rutas.get('/random',(req,res)=>{
	const {cant} = req.query 
	const sum = fork('./services/calcularRandom')
	sum.send(cant == undefined ? 1e7 : cant)
	sum.on('message',(msg)=>{
		res.json(msg)
	})
})










module.exports = rutas