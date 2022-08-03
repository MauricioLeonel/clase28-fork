
class ContainerChat{
	constructor(models){
		this.models = models
	}

	guardarChat = async(data)=>{
		const result = new this.models(data)
		return await result.save()
	}
	consultarChat = async()=>{
		return await this.models.find() 
	} 
	getByData = async(email)=>{
		return await this.models.findOne({email:email})
	}
	getByDataId = async(id)=>{
		return await this.models.findById(id)
	}
	

}


module.exports = ContainerChat