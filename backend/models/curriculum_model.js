require('dotenv').config();
const pool = require('../db')
const { changeDataFormat, findMissingID, findNewID } = require('../utils/util')

const getCurricula = async () => {
    let curr = [];
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u_name) AS authors, GROUP_CONCAT(u.picture_url) AS author_picture_urls, GROUP_CONCAT(u.picture_url) AS author_picture_urls, c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at, c.content
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at, c.content`;
    const [result] = await pool.execute(query);
    try {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors.split(","); // Split the authors string into an array
                let authorPictureUrls = result[i].author_picture_urls.split(",");
                
                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u_name) AS authors, GROUP_CONCAT(u.picture_url) AS author_picture_urls, c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE h.h_name = '${home}'
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors.split(","); // Split the authors string into an array 
                let authorPictureUrls = result[i].author_picture_urls.split(",");    
                
                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u_name) AS authors, GROUP_CONCAT(u.picture_url) AS author_picture_urls, c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE t.t_name = '${type}'
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors.split(","); // Split the authors string into an array 
                let authorPictureUrls = result[i].author_picture_urls.split(",");  
                
                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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

const getCurriculumBySemester = async (semester) => {
    let curr = []
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u_name) AS authors, GROUP_CONCAT(u.picture_url) AS author_picture_urls, c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE c.semester = '${semester}'
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at`
    const [result] = await pool.execute(query);
    try{
        if(result.length > 0){
            for(var i = 0; i < result.length; i++){
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors.split(","); // Split the authors string into an array 
                let authorPictureUrls = result[i].author_picture_urls.split(",");   
                
                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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
                "message": `No Currirula of semester '${semester}'`,
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
                  (SELECT GROUP_CONCAT(picture_url) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id)) AS author_picture_urls,
                   c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at, c.content
                   FROM curricula c 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE c.id IN (SELECT cid FROM user_curriculum WHERE uid = '${id}')
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at, c.content`;
    const [result] = await pool.execute(query);
    try {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors ? result[i].authors.split(",") : []; // Split the authors string into an array or assign an empty array if authors is null
                let authorPictureUrls = result[i].author_picture_urls? result[i].author_picture_urls.split(",") : [];

                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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
                  (SELECT GROUP_CONCAT(picture_url) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id)) AS author_picture_urls,
                   c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at, c.content
                   FROM curricula c 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE CONCAT(
                    c.title, c.semester, h.h_name, t.t_name, c.content,
                    (SELECT GROUP_CONCAT(u_name) FROM users WHERE id IN (SELECT uid FROM user_curriculum WHERE cid = c.id))
                   ) LIKE '%${kw}%' 
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at, c.content`;
    const [result] = await pool.execute(query);
    try {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                let date_last = changeDataFormat(result[i].last_update);
                let date_create = changeDataFormat(result[i].created_at);
                let authors = result[i].authors ? result[i].authors.split(",") : []; // Split the authors string into an array or assign an empty array if authors is null
                let authorPictureUrls = result[i].author_picture_urls? result[i].author_picture_urls.split(",") : [];

                let authorObjects = [];
                for (let j = 0; j < authors.length; j++) {
                    let authorObject = {
                        name: authors[j],
                        picture_url: authorPictureUrls[j]
                    };
                    authorObjects.push(authorObject);
                }

                let curriculum = {
                    "id": result[i].id,
                    "title": result[i].title,
                    "author": authorObjects,
                    "semester": result[i].semester,
                    "home": result[i].h_name,
                    "type": result[i].t_name,
                    "last_update": date_last,
                    "file_word": result[i].url_word,
                    "file_pdf": result[i].url_pdf,
                    "created": date_create,
                    "content": result[i].content
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

const getCurriculumByID = async (id) => {
    const query = `SELECT c.id, c.title, GROUP_CONCAT(u.u_name) AS authors, c.semester, h.h_name, t.t_name, c.last_update, f.url_word, f.url_pdf, c.created_at, c.content
                   FROM curricula c 
                   JOIN user_curriculum u_c ON c.id = u_c.cid 
                   JOIN users u ON u_c.uid = u.id 
                   JOIN homes h ON c.home_id = h.id 
                   JOIN types t ON c.type_id = t.id 
                   LEFT JOIN files f ON c.file_id = f.id
                   WHERE c.id = ${id}
                   GROUP BY c.id, c.title, c.semester, c.last_update, h.h_name, t.t_name, f.url_word, f.url_pdf, c.created_at, c.content`
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            let date_last = changeDataFormat(result[0].last_update);
            let date_create = changeDataFormat(result[0].created_at);
            let authors = result[0].authors.split(","); // Split the authors string into an array               
            let curriculum = {
                "id": result[0].id,
                "title": result[0].title,
                "author": authors,
                "semester": result[0].semester,
                "home": result[0].h_name,
                "type": result[0].t_name,
                "last_update": date_last,
                "file_word": result[0].url_word,
                "file_pdf": result[0].url_pdf,
                "created": date_create,
                "content": result[0].content
            }
            return {
                "message": "Success",
                "code": "000",
                "data": curriculum
            }
        }
        if(result.length === 0){
            return {
                "message": `No Currirula of id '${id}'`,
                "code": "001"
            }
        }
        return {
            "message": 'Server Response Error',
            "code": "999"
        }
    }catch(err){
        return err
    }
};

const createCurriculum = async(c) => {

    let newFile_id = -1;
    let curriculum = {
        title: c.title,
        semester: c.semester,
        home_id: c.home_id,
        type_id: c.type_id,
        last_update: c.last_update,
    }
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        if(c.file_url_word != null && c.file_url_pdf != null){
            const [result_f] = await conn.query('INSERT INTO files (url_word, url_pdf) VALUES (?,?)', [c.file_url_word, c.file_url_pdf]);
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
                "message": 'Server Response Error',
                "code": "500"
            }
        }
        await conn.query('COMMIT');
        return {
            "message": 'Success',
            "code": "000",
            "data": {
                "id": newCurriID,
                "title": curriculum.title
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

const updateCurriculum = async (id, curriculum) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // Update authors if provided
        if (curriculum.author_id_list) {
            const author_id_list = curriculum.author_id_list;
            delete curriculum.author_id_list; // Remove from curriculum object to not include in basic info update

            let currAuthorID = [];
            const getCurrentAuthor = await conn.query('SELECT * FROM user_curriculum WHERE cid = ?', [id]);
            for (let i = 0; i < getCurrentAuthor[0].length; i++) {
                currAuthorID.push(getCurrentAuthor[0][i].uid);
            }

            const toRemoveID = findMissingID(currAuthorID, author_id_list);
            const newID = findNewID(currAuthorID, author_id_list);

            for (let i = 0; i < toRemoveID.length; i++) {
                await conn.query('DELETE FROM user_curriculum WHERE uid = ? AND cid = ?', [toRemoveID[i], id]);
            }

            for (let i = 0; i < newID.length; i++) {
                await conn.query('INSERT INTO user_curriculum (uid, cid) VALUES (?, ?)', [newID[i], id]);    
            }
        }

        // Update basic info if there are fields to update
        if (Object.keys(curriculum).length > 0) {
            const setClauses = Object.entries(curriculum).map(([column, value]) => `${column} = '${value}'`).join(', ');
            const query = `UPDATE curricula SET ${setClauses} WHERE id = ${id};`;

            const [result] = await conn.execute(query);
            if (result.affectedRows == 0) {
                throw new Error('No rows updated');
            }
        }

        await conn.query('COMMIT');
        return {
            "message": "Success",
            "code": "000"
        };
    } catch (error) {
        await conn.query('ROLLBACK');
        return {
            "message": error.message,
            "code": "999"
        };
    } finally {
        await conn.release();
    }
};


const delCurriculum = async (cid, file_word) => {

    const query1 = `DELETE FROM user_curriculum WHERE cid = ${cid}`;
    const query2 = `DELETE FROM curricula WHERE id = ${cid}`;
    const query3 = `DELETE FROM files WHERE url_word = '${file_word}'`;
    
    const conn = await pool.getConnection();
    try{
        await conn.query('START TRANSACTION');
        await conn.execute(query1);
        await conn.execute(query2);
        await conn.execute(query3);
        await conn.query('COMMIT');
        return {
            "message": "Success",
            "code": "000"
        }
    }catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return {
            "message": error,
            "code": "999"
        }
    } finally {
        await conn.release();
    }
};

module.exports = {
    getCurricula,
    getCurriculumByHome,
    getCurriculumByType,
    getCurriculumBySemester,
    getCurriculumByKeyWord,
    getCurriculumByUserId,
    getCurriculumByID,
    createCurriculum,
    updateCurriculum,
    delCurriculum
};