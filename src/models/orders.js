const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const foodModel = require('./foods');
const moment = require('moment-timezone');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllOrders = () => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
    `;
    return dbPool.execute(SQLQuery);
};

const getOrdersBySellerId = async (seller_id) => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
        WHERE 
            o.seller_id = ?
    `;
    const [result] = await dbPool.execute(SQLQuery, [seller_id]);

    if (result.length === 0) {
        throw new Error(`Order dengan id seller "${seller_id}" tidak ditemukan`);
    }
    return result;
};

const getOrdersByCustomerId = async (customer_id) => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
        WHERE 
            o.customer_id = ?
    `;
    const [result] = await dbPool.execute(SQLQuery, [customer_id]);

    if (result.length === 0) {
        throw new Error(`Order dengan id customer "${customer_id}" tidak ditemukan`);
    }
    return result;
};

const getOrdersByFoodId = async (food_id) => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
        WHERE 
            o.food_id = ?
    `;
    const [result] = await dbPool.execute(SQLQuery, [food_id]);

    if (result.length === 0) {
        throw new Error(`Order dengan id food "${food_id}" tidak ditemukan`);
    }
    return result;
};

const getOrdersByOrderId = async (order_id) => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
        WHERE 
            o.order_id = ?
    `;
    const [result] = await dbPool.execute(SQLQuery, [order_id]);

    if (result.length === 0) {
        throw new Error(`Order dengan id "${order_id}" tidak ditemukan`);
    }
    return result;
};

const checkNewOrder = async (seller_id) => {
    const SQLQuery = `
        SELECT 
            o.order_id, 
            o.food_id, 
            o.seller_id, 
            o.customer_id, 
            o.amount, 
            o.price, 
            o.status,
            f.name AS food_name,
            s.name AS seller_name,
            c.name AS customer_name
        FROM 
            orders o
        INNER JOIN 
            food f ON o.food_id = f.id
        INNER JOIN 
            seller s ON o.seller_id = s.id_seller
        INNER JOIN 
            customer c ON o.customer_id = c.id_cust
        WHERE 
            o.seller_id = ? AND o.status = "diterima"
    `;
    const [result] = await dbPool.execute(SQLQuery, [seller_id]);

    if (result.length === 0) {
        throw new Error(`Order baru tidak ada`);
    }
    return result;
};




const createNewOrder = async (body) => {
    const { food_id, seller_id, customer_id, amount, token } = body;
    const decodedToken = jwt.verify(token, jwtSecret);

    const foodData = await foodModel.getFoodById(food_id);
    const foodPrice = foodData.price;
    const foodStock = foodData.stock;
    const price = foodPrice * amount;
    if (amount > foodStock) {
        throw new Error('Jumlah pesanan melebihi stok makanan yang tersedia');
    }
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;
    const status = "diterima";
    const order_id = nanoid(16);

    const dataFoodToUpdate = {
        food_id: food_id,
        amount: amount
    };
    await foodModel.updateFoodByOrderFood(dataFoodToUpdate);

    const SQLQuery = `INSERT INTO orders (order_id, food_id, seller_id, customer_id, amount, price, status, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [order_id , food_id, seller_id, customer_id, amount, price, status, createdAt, updatedAt];

    return dbPool.execute(SQLQuery, values);
};


const updateOrder = (body, idFood) => {
    const SQLQuery = `  UPDATE food 
                        SET name='${body.name}', price='${body.price}', stock='${body.stock}' 
                        WHERE id=${idFood}`;

    return dbPool.execute(SQLQuery);
}

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
    const SQLQuery = 'SELECT order_id, food_id, seller_id, customer_id, amount, price, status, createdAt, updatedAt FROM orders WHERE order_id=?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Data Makanan Tidak Ditemukan');
    }

    return rows[0];
}

const updateOrderToDiproses = async (body) => {
    const { order_id, seller_id, token } = body;
    const order = await getOrdersByOrderId(order_id);

    if (!order) {
        throw new Error('Order tidak ditemukan');
    }

    // Verifikasi token
    const decodedToken = jwt.verify(token, jwtSecret);
    console.log(order[0].seller_id);
    console.log(seller_id);
    if (order[0].seller_id != seller_id) {
        throw new Error('Anda tidak memiliki izin untuk memperbarui order ini');
    }

    // Memastikan seller_id dari order sesuai dengan seller_id yang diberikan
    if (order[0].seller_id != seller_id) {
        throw new Error('Anda tidak memiliki izin untuk memperbarui order ini');
    }
    const status = "diproses";
    const SQLQuery = `UPDATE orders SET status=? WHERE order_id=?`;
    const [result] = await dbPool.execute(SQLQuery, [status, order_id]);

    if (result.affectedRows === 0) {
        throw new Error('Data Orders tidak ada');
    }

    return { message: 'Data Orders Berhasil diperbaharui sekarang status nya sedang diproses' };
};


module.exports = {
    getAllOrders,
    createNewOrder,
    updateOrder,
    deleteOrder,
    getOrdersByOrderId,
    getOrdersBySellerId,
    getOrdersByCustomerId,
    getOrdersByFoodId,
    checkNewOrder,
    updateOrderToDiproses
}