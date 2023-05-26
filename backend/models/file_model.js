require('dotenv').config();
const pool = require('../db')

const getUrlByID = async (id) => {
    const query = `SELECT url_word FROM files WHERE files.id = ${id}`
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "url": result[0].url_word
                }
            }
        }else if(result.length === 0){
            return {
                "message": "Invalid File ID",
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
}

module.exports = {
    getUrlByID,
};