require('dotenv').config();
const pool = require('../db')

const getAllGroupName = async () => {
    const query = `SELECT groups.g_name FROM groups`;
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            let list = []
            for(var i = 0; i < result.length; i++){
                list.push(result[i].g_name)
            }
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "group_name_list": list
                }
            }
        }else if(result.length === 0){
            return {
                "message": "No Groups Existed",
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

const getIdByGroupName = async (group_name) => {

    const query = `SELECT id FROM \`groups\` WHERE \`groups\`.g_name = '${group_name}'`
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
                "message": "Invalid Group Name",
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
    getAllGroupName,
    getIdByGroupName
};