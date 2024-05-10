const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const foodModel = require('./foods');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllOrders = () => {
    const SQLQuery = 'SELECT id, sellerId, name, price, stock, CONCAT("/assets/", photo) AS photo FROM food';

    return dbPool.execute(SQLQuery);
}

const createNewOrder = async (body) => {
    const { foodId, userId, amount, sellerId, token } = body;
    const decodedToken = jwt.verify(token, jwtSecret);
    const orderId = nanoid(16);
    const foodData = await foodModel.getFoodById(foodId);
    const foodPrice = foodData.price;
    const price = foodPrice * amount;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const status = "dipesan";

    const dataFoodToUpdate = {
        foodId: foodId,
        amount: amount
    };


    foodModel.updateFoodByOrderFood(dataFoodToUpdate);

    const SQLQuery = `INSERT INTO orderfood (id, foodId, sellerId, userId, amount, price, status, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [orderId ,foodId, sellerId, userId,amount, price, status, createdAt, updatedAt];
    return dbPool.execute(SQLQuery, values);
}

// const updateOrder = (body, idFood) => {
//     const SQLQuery = `  UPDATE food 
//                         SET name='${body.name}', price='${body.price}', stock='${body.stock}' 
//                         WHERE id=${idFood}`;

//     return dbPool.execute(SQLQuery);
// }

const deleteOrder = async (foodData) => {
    const { id, sellerId, token } = foodData;
    const food = await getOrderById(id);
    const decodedToken = jwt.verify(token, jwtSecret);

    if (food.sellerId !== sellerId) {
        throw new Error('Anda tidak memiliki izin untuk menghapus data makanan ini');
    }

    const SQLQuery = `DELETE FROM food WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [id]);

    if (result.affectedRows === 0) {
        throw new Error('Data makanan tidak ditemukan');
    }

    return { message: 'Data makanan berhasil dihapus' };
}


const getOrderById = async (id) => {
    const SQLQuery = 'SELECT id, sellerId, name, price, stock, CONCAT("/assets/", photo) AS photo FROM food';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }

    return rows[0];
}

const updateOrder = async (foodData) => {
    const { id, sellerId, token, price, stock, name } = foodData;
    const food = await getOrderById(id);
    const decodedToken = jwt.verify(token, jwtSecret);
    console.log(food.sellerId, sellerId);
    if (food.sellerId !== sellerId) {
        throw new Error('Anda tidak memiliki izin untuk update data makanan ini');
    }

    const SQLQuery = `UPDATE food SET name=?, price=?, stock=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [name, price, stock, id]);


    if (result.affectedRows === 0) {
        throw new Error('Data makanan tidak ditemukan');
    }

    return { message: 'Data makanan berhasil diperbaharui' };
}

module.exports = {
    getAllOrders,
    createNewOrder,
    updateOrder,
    deleteOrder,
    getOrderById
}