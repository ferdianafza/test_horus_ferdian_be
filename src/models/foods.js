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

    const SQLQuery = `INSERT INTO food (id, sellerId, name, price, stock, photo) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [foodId, sellerId, name, price, stock, photo];

    return dbPool.execute(SQLQuery, values);
}

const updateFood = (body, idFood) => {
    const SQLQuery = `  UPDATE food 
                        SET name='${body.name}', price='${body.price}', stock='${body.stock}' 
                        WHERE id=${idFood}`;

    return dbPool.execute(SQLQuery);
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
    const SQLQuery = 'SELECT id, sellerId, name, price, stock, CONCAT("/assets/", photo) AS photo FROM food';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getAllFoods,
    createNewFood,
    updateFood,
    deleteFood,
    getFoodById
}