require('dotenv').config();
const pool = require('../db')
const { changeDataFormat } = require('../utils/util')

const getAllCurriculum = async () => {
    let curr = [];
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u.u_name) AS authors, c.semester, h.h_name, t.t_name, f.url, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   GROUP BY c.id, c.title, c.semester, h.h_name, t.t_name, f.url, c.created_at`;
    const [result] = await pool.execute(query);
    try {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                let date = changeDataFormat(result[i].created_at);
                let authors = result[i].authors.split(","); // Split the authors string into an array
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authors,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": date
                };
                curr.push(curriculum);
            }
        }
        if (curr.length > 0) {
            return {
                "message": "Success",
                "code": "000",
                "data": curr
            };
        } else {
            return {
                "message": "No Curricula in database",
                "code": "001"
            };
        }
    } catch (err) {
        return err;
    }
};


const getCurriculumWithType = async (type) => {
    let curr = []
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u.u_name) AS authors, c.semester, h.h_name, t.t_name, f.url, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE t.t_name = '${type}'
                   GROUP BY c.id, c.title, c.semester, h.h_name, t.t_name, f.url, c.created_at`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let date = changeDataFormat(result[i].created_at) 
                let authors = result[i].authors.split(","); // Split the authors string into an array               
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authors,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": date
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
                "message": `No Currirula of type '${type}'`,
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
};

const getCurriculumByUserId = async (id) => {
    let curr = [];
    const query = `SELECT c.id, c.title, 
                  (SELECT GROUP_CONCAT(u_name) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id)) AS authors,
                   c.semester, h.h_name, t.t_name, f.url, c.created_at
                   FROM curricula c 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE c.id IN (SELECT cid FROM user_curriculum WHERE uid = '${id}')
                   GROUP BY c.id, c.title, c.semester, h.h_name, t.t_name, f.url, c.created_at`;
    const [result] = await pool.execute(query);
    try {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                let date = changeDataFormat(result[i].created_at);
                let authors = result[i].authors ? result[i].authors.split(",") : []; // Split the authors string into an array or assign an empty array if authors is null
                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authors,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "file": result[i].url,
                    "created": date
                };
                curr.push(curriculum);
            }
        }
        if (curr.length > 0) {
            return {
                "message": "Success",
                "code": "000",
                "data": curr
            };
        } else {
            return {
                "message": `No Curricula written by user ${id} `,
                "code": "001"
            };
        }
    } catch (err) {
        return err;
    }
};


module.exports = {
    getAllCurriculum,
    getCurriculumWithType,
    getCurriculumByUserId
};