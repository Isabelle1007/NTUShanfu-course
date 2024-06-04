require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db')
const { BCRYPT_SALT, TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 min by seconds
const salt = parseInt(BCRYPT_SALT);

// const USER_ROLE = {
//     admin: 1,
//     coordinator: 2,
//     member: 3
// };

const getUserByKey = async (key, value) => {
    let query;
    if( key === 'id' || key === 'home_id' || key === 'group_id' || key === 'role_id'){
        query = `SELECT u.*, r.r_name, h.h_name, g.g_name 
                 FROM users u JOIN roles r ON u.role_id = r.id 
                              JOIN homes h ON u.home_id = h.id 
                              JOIN \`groups\` g ON u.group_id = g.id 
                 WHERE u.${key} = ${value}`

    }else{
        query = `SELECT u.*, r.r_name, h.h_name, g.g_name 
                 FROM users u JOIN roles r ON u.role_id = r.id 
                              JOIN homes h ON u.home_id = h.id 
                              JOIN \`groups\` g ON u.group_id = g.id 
                 WHERE u.${key} = '${value}'`
    }
    const [result] = await pool.execute(query);
    try{
        if(result.length === 1){
            for(var i = 0; i < result.length; i++){
                let info = {
                    "id": result[i].id,
                    "name": result[i].u_name,
                    "account": result[i].account,
                    "role": result[i].r_name,
                    "home": result[i].h_name,
                    "group": result[i].g_name,
                    "join_semester": result[i].join_semester,
                    "gender": result[i].gender,
                    "birthday": result[i].birthday,
                    "major": result[i].major,
                    "student id": result[i].student_id,
                    "picture_url": result[i].picture_url,
                    "email": result[i].email
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
}

const getInfoByUserId = async (id) => {
    return getUserByKey('id', id);
};

const getInfoByUserAccount = async (account) => {
    return getUserByKey('account', account);
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
                    "account": result[i].account,
                    "role": result[i].r_name,
                    "home": result[i].h_name,
                    "group": result[i].g_name,
                    "join semester": result[i].join_semester,
                    "gender": result[i].gender,
                    "birthday": result[i].birthday,
                    "major": result[i].major,
                    "student id": result[i].student_id,
                    "picture_url": result[i].picture_url,
                    "email": result[i].email
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
    const { name, account, password, role_id, gender } = req.body
    const conn = await pool.getConnection();
    try{
        const [result] = await conn.query('INSERT INTO users (u_name, account, password, role_id, home_id, gender ) VALUES (?,?,?,?,?,?)', [name, account, password, role_id, homeID, gender]);
        let newUserID = result.insertId
        if(newUserID != -1){
            return {
                "message": "Success",
                "code": "000",
                "data":{
                    "id": newUserID,
                    "name": name,
                    "account": account,
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

const signUp = async (name, roleId, account, password, picture_url, home, group, join_semester, gender, birthday, major, student_id, email) => {
    
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const accounts = await conn.query('SELECT account FROM users WHERE account = ? FOR UPDATE', [account]);
        if (accounts[0].length > 0) {
            await conn.query('COMMIT');
            return {
                "message": 'account Already Exists', 
                "code": "001"
            };
        }

        const loginAt = new Date();

        const user = {
            u_name: name,
            account: account,
            password: await bcrypt.hash(password, salt),
            role_id: roleId,
            access_expired: TOKEN_EXPIRE,
            login_at: loginAt,
        };

        if(picture_url != "") user.picture_url = picture_url
        if(join_semester != "") user.join_semester = join_semester
        if(home != "") user.home_id = home
        if(group != "") user.group_id = group
        if(gender != "") user.gender = gender
        if(birthday != "") user.birthday = birthday
        if(major != "") user.major = major
        if(student_id != "") user.student_id = student_id
        if(email != "") user.email = email

        const accessToken = jwt.sign(
            {
                name: user.name,
                account: user.account,
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
                "account": user.account,
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

const login = async (account, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const [users] = await conn.query('SELECT * FROM users WHERE account = ?', [account]);
        if (users.length === 0){
            await conn.query('COMMIT');
            console.log("account does not exist")
            return {
                code: "001", 
                message: 'Error: account does not exist' };
        }
        const user = users[0];
        pw_correct = await bcrypt.compare(password, user.password)
        if(!pw_correct){
            await conn.query('COMMIT');
            return {
                code: "002",
                message: "Password is wrong",
            };
        }
        const loginAt = new Date();
        const accessToken = jwt.sign(
            {
                name: user.name,
                account: user.account,
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
                "account": user.account,
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

const updateInfoByAccount = async (account, profile) => {
    const setClauses = Object.entries(profile).map(([column, value]) => `${column} = '${value}'`).join(', ');
    const query = `UPDATE users SET ${setClauses} WHERE account = '${account}';`;
    
    try{
        const [result] = await pool.execute(query);
        if(result.affectedRows > 0){
            return {
                "message": "Success",
                "code": "000"
            }
        }else{
            return {
                "message": 'Server Response Error',
                "code": "999"
            }
        }
    }catch (error) {
        console.log(error);
        return {
            "message": error,
            "code": "999"
        }
    }

}

module.exports = {
    // USER_ROLE,
    getInfoByUserId,
    getInfoByUserAccount,
    getInfoOfAllUsers,
    getIdByUserName,
    postAnUser,
    signUp,
    login,
    updateInfoByAccount
};