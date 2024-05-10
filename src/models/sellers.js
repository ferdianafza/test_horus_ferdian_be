const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllSellers = () => {
    const SQLQuery = 'SELECT id, name, email, address, latitude, longitude FROM seller';

    return dbPool.execute(SQLQuery);
}


const createNewSeller = async (body) => {
    const { email, password, name,provinceId, cityId, address, latitude, longitude } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sellerId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const SQLQuery = `INSERT INTO seller (id, email, password, name, provinceId, cityId, address, latitude, longitude, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)`;
    const values = [sellerId, email, hashedPassword, name,provinceId,cityId, address, latitude, longitude, createdAt, updatedAt];

    return dbPool.execute(SQLQuery, values);
}

const authenticateSeller = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT id, name, email, password FROM seller WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);
    if (rows.length === 0) {
        throw new Error('Seller Tidak Ditemukan');
    }

    const seller = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, seller.password);

    if (!isPasswordValid) {
        throw new Error('Password Tidak Valid!');
    }

    const token = jwt.sign({ id: seller.id, email: seller.email }, jwtSecret, { expiresIn: '1h' });
    return token;
}


const updateSeller = (body, idSeller) => {
    const SQLQuery = `  UPDATE seller 
                        SET name='${body.name}', email='${body.email}', address='${body.address}' 
                        WHERE id=${idSeller}`;

    return dbPool.execute(SQLQuery);
}

const deleteSeller = (idSeller) => {
    const SQLQuery = `DELETE FROM seller WHERE id=${idSeller}`;

    return dbPool.execute(SQLQuery);
}

const getSellerByEmail = async (email) => {
    const SQLQuery = 'SELECT * FROM seller WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getAllSellers,
    createNewSeller,
    updateSeller,
    deleteSeller,
    getSellerByEmail,
    authenticateSeller,
}