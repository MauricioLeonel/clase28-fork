const containerMongo = require('../../container/mongo')

class DaoMongoCarrito extends containerMongo{
	constructor(data){
		super(data)
	}

	saveData = async (data)=>{
		return await this.guardarChat(data)
	}

	getAll = async()=>{
		return await this.consultarChat()
	}
	getByEmail = async(email)=>{
		return await this.getByData(email)
	}
	getById = async(id)=>{
		return await this.getByDataId(id)
	}
	

}


module.exports = DaoMongoCarrito