const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllSellers = () => {
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name, 
            s.desc,
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo
        FROM 
            seller s
        INNER JOIN 
            user u ON s.user_user_id = u.user_id`;

    return dbPool.execute(SQLQuery);
}


const createNewSeller = async (body) => {
    const { username, email, password, confirmPassword, role, photo, name, desc, nomorWA, address, city_id, city_province_id, } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (body.password != body.confirmPassword) {
        throw new Error('password dan konfirmasi password tidak sama!!!');
    }

    const checkEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const [existingUsers] = await dbPool.execute(checkEmailQuery, [email]);

    if (existingUsers.length > 0) {
        throw new Error('Email sudah digunakan!');
    }
    
    const user_id = nanoid(16);
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;
    const SQLQueryUser = `INSERT INTO user (user_id, username, email, 
                                        password, role , createdAt, updatedAt, photo ) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [user_id, username, email, hashedPassword, role, createdAt, updatedAt, photo];
    dbPool.execute(SQLQueryUser, valuesUser);
    

    const id_seller = nanoid(16);
    const user_user_id = user_id;

    const SQLQuerySeller = `INSERT INTO seller (id_seller, name, \`desc\`, nomorWA, address, city_id, city_province_id, user_user_id ) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesSeller = [id_seller, name, desc, nomorWA, address, city_id, city_province_id, user_user_id];
    return dbPool.execute(SQLQuerySeller, valuesSeller);
}


const authenticateSeller = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT username, email, password FROM user WHERE email = ?';
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
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name, 
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.password, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("/assets/", u.photo) AS photo
        FROM 
            seller s 
        INNER JOIN 
            user u ON s.user_user_id = u.user_id
        WHERE 
            u.email = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

const getSellerById = async (id_seller) => {
    const SQLQuery = `
        SELECT 
            s.id_seller, 
            s.name, 
            s.nomorWA, 
            s.address, 
            s.city_id, 
            s.city_province_id, 
            u.user_id, 
            u.username, 
            u.email, 
            u.role, 
            u.createdAt, 
            u.updatedAt, 
            CONCAT("https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/", u.photo) AS photo 
        FROM 
            seller s 
        INNER JOIN 
            user u ON s.user_user_id = u.user_id
        WHERE 
            s.id_seller = ?`;
    const [rows, _] = await dbPool.execute(SQLQuery, [id_seller]);

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
    getSellerById
}