const serviceModel = require('../models/servicesModel')


const getServicesAPI = async (req, res, next) => {
    const service = await serviceModel.getAllServices();
    if(service==null) res.send({service,status:500}); 
    else if(service.length  > 0) {
        res.send({service,status:200})
    } else {
        res.send({service:null,status:404})
    }
}
module.exports = {getServicesAPI}