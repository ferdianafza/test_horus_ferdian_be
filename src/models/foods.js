const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllFoods = () => {
    const SQLQuery = 'SELECT id, sellerId, name, price, stock, CONCAT("/assets/", photo) AS photo FROM food';

    return dbPool.execute(SQLQuery);
}

const createNewFood = async (body) => {
    const { sellerId, name, price, stock, photo, token } = body;
    const decodedToken = jwt.verify(token, jwtSecret);
    const foodId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const SQLQuery = `INSERT INTO food (id, sellerId, name, price, stock, photo, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [foodId, sellerId, name, price, stock, photo, createdAt, updatedAt];

    return dbPool.execute(SQLQuery, values);
}

const deleteFood = async (foodData) => {
    const { id, sellerId, token } = foodData;
    const food = await getFoodById(id);
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


const getFoodById = async (id) => {
    console.log(id);
    const SQLQuery = 'SELECT id, sellerId, name, price, stock, CONCAT("/assets/", photo) AS photo FROM food WHERE id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }
    console.log(rows[0]);
    return rows[0];
}

const updateFood = async (foodData) => {
    const { id, sellerId, token, price, stock, name } = foodData;
    // console.log(foodData);
    const food = await getFoodById(foodData.id);
    console.log(food);
    const decodedToken = jwt.verify(token, jwtSecret);
    console.log(food.sellerId, sellerId);
    if (food.sellerId != sellerId) {
        throw new Error('Anda tidak memiliki izin untuk update data makanan ini');
    }

    const SQLQuery = `UPDATE food SET name=?, price=?, stock=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [name, price, stock, id]);


    if (result.affectedRows === 0) {
        throw new Error('Data makanan tidak ditemukan');
    }

    return { message: 'Data makanan berhasil diperbaharui' };
}

const updateFoodByOrderFood = async (foodData) => {
    const { foodId, amount } = foodData;
    const food = await getFoodById(foodId);
    const foodDataStock = food.stock - amount;

    const SQLQuery = `UPDATE food SET stock=? WHERE id=?`;
    const [result] = await dbPool.execute(SQLQuery, [foodDataStock, foodId]);
}

module.exports = {
    getAllFoods,
    createNewFood,
    updateFood,
    deleteFood,
    getFoodById,
    updateFoodByOrderFood,
}