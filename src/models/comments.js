const dbPool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const saltRounds = 10;
const jwtSecret = 'SECRET';

const getAllComments = () => {
    const SQLQuery = 'SELECT id_comment, id_seller, id_cust, description, createdAt FROM comment';

    return dbPool.execute(SQLQuery);
}

const getCommentByIdSeller = async (id_seller) => {
    const SQLQuery = 'SELECT id_comment, id_seller, id_cust, description, createdAt FROM comment WHERE id_seller = ?';

    const [result] = await dbPool.execute(SQLQuery, [id_seller]);
    return result;

}


const createComment = async (body) => {
    const {
        id_seller,
        id_cust,
        description
    } = body;

    const id_comment = nanoid(16);
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    const SQLQuery = `INSERT INTO comment (id_comment, id_seller, id_cust, description, createdAt) 
                      VALUES (?, ?, ?, ?, ?)`;
    const values = [
        id_comment,
        id_seller || null,
        id_cust || null,
        description || null,
        createdAt
    ];

    return dbPool.execute(SQLQuery, values);
};






module.exports = {
    getAllComments,
    createComment,
    getCommentByIdSeller
}