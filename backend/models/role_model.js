require('dotenv').config();
const pool = require('../db')

const getRoleByID = async (id) => {

    const query = `SELECT r_name FROM roles WHERE roles.id = ${id}`
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "name": result[0].r_name
                }
            }
        }else if(result.length === 0){
            return {
                "message": "Invalid Role ID",
                "code": "001"
            }
        }else{
            return {
                "message": "Server Response Error",
                "code": "500"
            }
        }
    }catch(err){
        return err
    }
};

module.exports = {
    getRoleByID
};