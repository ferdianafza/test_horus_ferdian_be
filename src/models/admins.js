const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllAdmins = () => {
    const SQLQuery = 'SELECT id, name, email, address, latitude, longitude FROM admin';

    return dbPool.execute(SQLQuery);
}


const createNewAdmin = async (body) => {
    const { email, password, name,provinceId, cityId, address, latitude, longitude } = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const adminId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const SQLQuery = `INSERT INTO admin (id, email, password, name, provinceId, cityId, address, latitude, longitude, createdAt, updatedAt) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)`;
    const values = [adminId, email, hashedPassword, name,provinceId,cityId, address, latitude, longitude, createdAt, updatedAt];

    return dbPool.execute(SQLQuery, values);
}

const authenticateAdmin = async (body) => {
    
    console.log(body.email, body.password);
    if (!body.email || !body.password) {
        throw new Error('Email dan password harus diisi');
    }
    const SQLQuery = 'SELECT id, name, email, password FROM admin WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [body.email]);
    if (rows.length === 0) {
        throw new Error('Admin Tidak Ditemukan');
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, admin.password);

    if (!isPasswordValid) {
        throw new Error('Password Tidak Valid!');
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, { expiresIn: '1h' });
    return token;
}


const updateAdmin = (body, idAdmin) => {
    const SQLQuery = `  UPDATE admin 
                        SET name='${body.name}', email='${body.email}', address='${body.address}' 
                        WHERE id=${idAdmin}`;

    return dbPool.execute(SQLQuery);
}

const deleteAdmin = (idAdmin) => {
    const SQLQuery = `DELETE FROM admin WHERE id=${idAdmin}`;

    return dbPool.execute(SQLQuery);
}

const getAdminByEmail = async (email) => {
    const SQLQuery = 'SELECT * FROM admin WHERE email = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [email]);

    if (rows.length === 0) {
        throw new Error('Akun Tidak Ditemukan');
    }

    return rows[0];
}

module.exports = {
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByEmail,
    authenticateAdmin,
}