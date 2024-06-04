require('dotenv').config();
const pool = require('../db')

const getAllSubjectName = async () => {
    const query = `SELECT subjects.s_name FROM subjects`;
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            let list = []
            for(var i = 0; i < result.length; i++){
                list.push(result[i].s_name)
            }
            return {
                "message": "Success",
                "code": "000",
                "data": {
                    "subject_name_list": list
                }
            }
        }else if(result.length === 0){
            return {
                "message": "No subjects Existed",
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

const getIdBySubjectName = async (subject) => {

    const query = `SELECT id FROM subjects WHERE subjects.s_name = '${subject_name}'`
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
                "message": "Invalid Subject Name",
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
    getAllSubjectName,
    getIdBySubjectName
};