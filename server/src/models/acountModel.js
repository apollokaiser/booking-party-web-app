const db = require('../config/database')
const checkAccount = async (username,password) => {
    try {
        const [rows, fields] = await db.query('select * from admin_user where USERNAME = ? and PASSWORD = ?',[username,password]);
        if(rows.length>0){
            return rows[0]} 
        else return undefined;
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = { checkAccount };