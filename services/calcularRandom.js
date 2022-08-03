process.on('message',cant=>{
	let result = {}
	for(let i=0; i < cant ; i++){
		let nro = Math.round(Math.random()*cant)
		if(!result[nro]){
			result[nro] = 1
		}else{
			result[nro] = result[nro] + 1
		}
	}
	process.send(result)

})