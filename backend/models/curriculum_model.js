require('dotenv').config();
const pool = require('../db')
const { changeDataFormat } = require('../utils/util')

const getCurricula = async () => {
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

const getCurriculumByHome = async (home) => {
    let curr = []
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u.u_name) AS authors, c.semester, h.h_name, t.t_name, f.url, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE h.h_name = '${home}'
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
                "message": `No Currirula in '${home}'`,
                "code": "001"
            }
        }
    }catch(err){
        return err
    }
};

const getCurriculumByType = async (type) => {
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

const getCurriculumByKeyWord = async (kw) => {
    let curr = [];
    const query = `SELECT c.id, c.title, 
                  (SELECT GROUP_CONCAT(u_name) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id)) AS authors,
                   c.semester, h.h_name, t.t_name, f.url, c.created_at
                   FROM curricula c 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE CONCAT(
                    c.title, c.semester, h.h_name, t.t_name, 
                    (SELECT GROUP_CONCAT(u_name) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id))
                   ) LIKE '%${kw}%' 
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
                "message": `No Curricula By keyword ${kw} `,
                "code": "001"
            };
        }
    } catch (err) {
        return err;
    }
};

const createCurriculum = async(c) => {

    let newFile_id = -1;
    let curriculum = {
        title: c.title,
        semester: c.semester,
        home_id: c.home_id,
        type_id: c.type_id
    }
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        if(c.file_url != null){
            const [result_f] = await conn.query('INSERT INTO files (url) VALUES ?', [c.file_url]);
            newFile_id = result_f.insertId
            curriculum.file_id = newFile_id
        }
        const [result_c] = await conn.query('INSERT INTO curricula SET ?', curriculum);
        let newCurriID = result_c.insertId
        if(newCurriID != -1){
            for(var i = 0; i < c.author_id_list.length; i++){
                await conn.query('INSERT INTO user_curriculum(uid, cid) VALUES (?, ?)', [c.author_id_list[i], result_c.insertId]);
            }
        }else{
            return {
                "message": 'Curriculum Creation Failed',
                "code": "500"
            }
        }
        await conn.query('COMMIT');
        return {
            "message": 'Success',
            "code": "000",
            "data": {
                "id": newCurriID,
            }
        }
    } catch (error) {
        await conn.query('ROLLBACK');
        console.log(error);
        return -1;
    } finally {
        await conn.release();
    }
};

module.exports = {
    getCurricula,
    getCurriculumByHome,
    getCurriculumByType,
    getCurriculumByUserId,
    getCurriculumByKeyWord,
    createCurriculum
};