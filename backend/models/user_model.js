require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../db')

const { BCRYPT_SALT, TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const salt = parseInt(BCRYPT_SALT);

const USER_ROLE = {
    admin: 1,
    coordinator: 2,
    member: 3
};

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

const postAnUser = async (req, homeID) => {
    const { name, email, password, role_id, gender } = req.body
    const conn = await pool.getConnection();
    try{
        const [result] = await conn.query('INSERT INTO users (u_name, email, password, role_id, home_id, gender ) VALUES (?,?,?,?,?,?)', [name, email, password, role_id, homeID, gender]);
        let newUserID = result.insertId
        if(newUserID != -1){
            return {
                "message": "Success",
                "code": "000",
                "data":{
                    "id": newUserID,
                    "name": name,
                    "email": email,
                    "home": req.body.home,
                    "gender": gender
                }
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

const signUp = async (name, roleId, email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const emails = await conn.query('SELECT email FROM users WHERE email = ? FOR UPDATE', [email]);
        if (emails[0].length > 0) {
            await conn.query('COMMIT');
            return {
                "message": 'Email Already Exists', 
                "code": "001"
            };
        }

        const loginAt = new Date();

        const user = {
            u_name: name,
            email: email,
            password: bcrypt.hashSync(password, salt),
            role_id: roleId,
            picture_url: null,
            access_expired: TOKEN_EXPIRE,
            login_at: loginAt,
        };

        const accessToken = jwt.sign(
            {
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
            TOKEN_SECRET
        );
        user.access_token = accessToken;

        const queryStr = 'INSERT INTO users SET ?';
        const [result] = await conn.query(queryStr, user);

        user.id = result.insertId;
        await conn.query('COMMIT');
        return {
            "message": "Success",
            "code": "000",
            "data": {
                "userID": user.id,
                "username": user.u_name,
                "email": user.email,
                "role_id": user.role_id
            }
        };

    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return {
            "message": error,
            "code": "999" 
        };

    } finally {
        await conn.release();
    }
};

const signIn = async (email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const [users] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            await conn.query('COMMIT');
            console.log("Email does not exist")
            return { error: 'Email does not exist' };
        }
        const user = users[0];

        if(!bcrypt.compare(password, user.password)){
            await conn.query('COMMIT');
            return {
                "message": "Password is wrong",
                "code": "999" 
            };
        }

        const loginAt = new Date();
        const accessToken = jwt.sign(
            {
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
            TOKEN_SECRET
        );

        const queryStr = 'UPDATE users SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
        await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);

        await conn.query('COMMIT');

        user.access_token = accessToken;
        user.login_at = loginAt;
        user.access_expired = TOKEN_EXPIRE;

        return {
            "message": "Success",
            "code": "000",
            "data": {
                "userID": user.id,
                "username": user.u_name,
                "email": user.email,
                "role_id": user.role_id,
                "login_at": user.login_at,
                "access_token": user.access_token
            }
        };

    } catch (error) {
        await conn.query('ROLLBACK');
        console.log(error)
        return {
            "message": error,
            "code": "999" 
        };

    } finally {
        await conn.release();
    }
};

module.exports = {
    USER_ROLE,
    getInfoByUserId,
    getInfoOfAllUsers,
    getIdByUserName,
    postAnUser,
    signUp,
    signIn
};