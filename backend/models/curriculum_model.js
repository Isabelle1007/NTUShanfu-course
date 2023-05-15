require('dotenv').config();
const pool = require('../db')
const axios = require("axios");

const getAllData = async () => {
    let data = [];
    try {
        await axios.get('http://35.75.145.100:1234/api/1.0/order/data')
        .then((res) => {
            let pid;
            let price;
            let color_code;
            let color_name
            let size;
            let qty;
            for(var i = 0; i < res.data.length; i++){
                const n = res.data[i]["list"].length
                for(var j = 0; j < n; j++){
                    pid = res.data[i]["list"][j]["id"]
                    price = res.data[i]["list"][j]["price"]
                    color_code = res.data[i]["list"][j]["color"]["code"]
                    size = res.data[i]["list"][j]["size"]
                    qty = res.data[i]["list"][j]["qty"]
                    color_name = res.data[i]["list"][j]["color"]["name"]
                    
                    let purchase = {
                        "pid": pid,
                        "price": price,
                        "color_code": color_code,
                        "color_name": color_name,
                        "size": size,
                        "qty": qty
                    }
                    data.push(purchase)
                }
            }
        })
        .catch((error) => {
            result = error.response.data.message;
            console.log(result)
        });
    } catch (error) {
        console.log(error);
    }

    try{
        // truncate db
        const deleteQuery = 'TRUNCATE purchase';
        const [deleteResult] = await pool.query(deleteQuery);

        for(var i = 0; i < data.length; i++){
            // insert each purchase into db
            const queryData = 'INSERT INTO purchase (pid, price, color_code, color_name, size, qty) values (?,?,?,?,?,?)'
            let values = [data[i].pid, data[i].price, data[i].color_code, data[i].color_name, data[i].size, data[i].qty]
            const [dataResult] = await pool.query(queryData, values);    
        }

        const result = {
            'data': {
                'message': 'insert data successfully',
                'number': data.length
            }
        }
        return result

    }catch(err){
        return err
    }
};

module.exports = {
    getAllData
};