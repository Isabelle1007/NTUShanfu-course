require('dotenv').config();
const pool = require('../db')

const getAllHomeName = async () => {
    const query = `SELECT homes.h_name FROM homes`;
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            let list = []
            for(var i = 0; i < result.length; i++){
                list.push(result[i].h_name)
            }
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "home_name_list": list
                }
            }
        }else if(result.length === 0){
            return {
                "message": "No Homes Existed",
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
    getAllHomeName,
    getIdByHomeName
};