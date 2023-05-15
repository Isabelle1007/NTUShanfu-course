require('dotenv').config();
const pool = require('../db')

const getAllCurriculum = async () => {
    let curr = []
    const query = `SELECT c.*, u.u_name, h.h_name, t.t_name, f.url 
                   FROM curricula c JOIN users u ON c.author_id = u.id 
                                    JOIN homes h ON c.home_id = h.id 
                                    JOIN types t ON c.type_id = t.id 
                                    LEFT JOIN files f ON c.file_id = f.id`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": result[i].u_name,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": result[i].created_at
                }
                curr.push(curriculum)
            }
        }
        if(curr.length > 0){
            return {
                "message": "Success",
                "code": "000",
                "data": curr
            }
        }else{
            return {
                "message": "No Currirula",
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
};

const getCurriculumWithType = async (type) => {
    let curr = []
    const query = `SELECT c.*, u.u_name, h.h_name, t.t_name, f.url 
                   FROM curricula c JOIN users u ON c.author_id = u.id 
                                    JOIN homes h ON c.home_id = h.id 
                                    JOIN types t ON c.type_id = t.id 
                                    LEFT JOIN files f ON c.file_id = f.id
                   WHERE t.t_name = '${type}'`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": result[i].u_name,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": result[i].created_at
                }
                curr.push(curriculum)
            }
        }
        if(curr.length > 0){
            return {
                "message": "Success",
                "code": "000",
                "data": curr
            }
        }else{
            return {
                "message": "No Currirula",
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
};

const getCurriculumByUserId = async (id) => {
    let curr = []
    const query = `SELECT c.*, u.u_name, h.h_name, t.t_name, f.url 
                   FROM curricula c JOIN users u ON c.author_id = u.id 
                                    JOIN homes h ON c.home_id = h.id 
                                    JOIN types t ON c.type_id = t.id 
                                    LEFT JOIN files f ON c.file_id = f.id
                   WHERE u.id = '${id}'`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": result[i].u_name,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": result[i].created_at
                }
                curr.push(curriculum)
            }
        }
        if(curr.length > 0){
            return {
                "message": "Success",
                "code": "000",
                "data": curr
            }
        }else{
            return {
                "message": "No Currirula",
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
};

module.exports = {
    getAllCurriculum,
    getCurriculumWithType,
    getCurriculumByUserId
};