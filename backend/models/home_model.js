require('dotenv').config();
const pool = require('../db')

const getIdByHomeName = async (home_name) => {

    const query = `SELECT id FROM homes WHERE homes.h_name = '${home_name}'`
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "id": result[0].id
                }
            }
        }else if(result.length === 0){
            return {
                "message": "Invalid Home Name",
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
    getIdByHomeName
};