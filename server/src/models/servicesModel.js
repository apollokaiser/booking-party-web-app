const db = require('../config/database')

module.exports = class Services {
    constructor(serviceName, serviceID,destination=null) {
        this.serviceID = serviceID,
        this.serviceName = serviceName
        this.destination = destination
    }
    static getAllServices = async (callback=null) => {
        try {
            const services = [];
            const [rows, fields] = await db.query('select * from services');
            if (rows.length > 0)
                rows.forEach(item => {
                    services.push(new Services(
                        item.serviceName,
                        item.serviceID,
                        item.destination,
                    ));
                });
                if(callback){
                    callback(services)
                }
                else 
                    return services;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    }
    static async getService(serviceID){
        try {
            const queryString = 'select * from services where serviceID =(?)';
            const [rows, fields] = await db.query(queryString,[serviceID]);
            if(rows.length >0 ){
                const services = new Services(rows[0].serviceName,rows[0].serviceID);
                return services;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

