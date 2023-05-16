require('dotenv').config();
const pool = require('../db')

const getInfoByUserId = async (id) => {
    const query = `SELECT u.*, r.r_name, h.h_name, g.g_name 
                   FROM users u JOIN roles r ON u.role_id = r.id 
                                JOIN homes h ON u.home_id = h.id 
                                JOIN \`groups\` g ON u.group_id = g.id 
                   WHERE u.id = ${id}`
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            for(var i = 0; i < result.length; i++){
                let info = {
                    "id": result[i].id,
                    "name": result[i].u_name,
                    "email": result[i].email,
                    "role": result[i].r_name,
                    "home": result[i].h_name,
                    "group": result[i].g_name,
                    "join semester": result[i].join_semester,
                    "gender": result[i].gender,
                    "birthday": result[i].birthday,
                    "department": result[i].department,
                    "student id": result[i].student_id,
                    "picture_url": result[i].picture_url
                }
                return {
                    "message": "Success",
                    "code": "000",
                    "data": info
                }
            }
        }
        if(result.length === 0){
            return {
                "message": "No User",
                "code": "001"
            }
            
        }else{
            return {
                "message": "Unknown Error",
                "code": "999"
            }
        }
    }catch(err){
        return err
    }
};

const getInfoOfAllUsers = async () => {
    let users = []
    const query = `SELECT u.*, r.r_name, h.h_name, g.g_name 
                   FROM users u JOIN roles r ON u.role_id = r.id 
                                JOIN homes h ON u.home_id = h.id 
                                JOIN \`groups\` g ON u.group_id = g.id`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let user = {
                    "id": result[i].id,
                    "name": result[i].u_name,
                    "email": result[i].email,
                    "role": result[i].r_name,
                    "home": result[i].h_name,
                    "group": result[i].g_name,
                    "join semester": result[i].join_semester,
                    "gender": result[i].gender,
                    "birthday": result[i].birthday,
                    "department": result[i].department,
                    "student id": result[i].student_id,
                    "picture_url": result[i].picture_url
                }
                users.push(user)
            }
            return {
                "message": "Success",
                "code": "000",
                "data": users
            }

        }else{
            return {
                "message": "No Users",
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
}

const getIdByUserName = async (name_list) => {
    let ids = []
    for(var i = 0; i < name_list.length; i++){
        const query = `SELECT id FROM users WHERE users.u_name = '${name_list[i]}'`
        const [result] = await pool.execute(query);
        try{
            if(result.length === 1){
                ids.push(result[0].id)
            }else if(result.length === 0){
                return {
                    "message": "Invalid User Name",
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
    return {
        "message": "Success",
        "code": "000",
        "data": {
            "id": ids
        }
    }
};

module.exports = {
    getInfoByUserId,
    getInfoOfAllUsers,
    getIdByUserName
};