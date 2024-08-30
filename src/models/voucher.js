const dbPool = require('../config/database');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');

const jwtSecret = 'SECRET';


const getAllVouchers = () => {
    const SQLQuery = `
        SELECT 
            id, 
            nama, 
            CONCAT("https://photo-voucher.s3.ap-southeast-1.amazonaws.com/storage_folder/", foto) AS foto, 
            kategori, 
            status 
        FROM voucher;
    `;

    return dbPool.execute(SQLQuery);
};

/** 
 * Function to create a new voucher 
 */
const createNewVoucher = async (body) => {
    const {
        nama,
        foto,
        kategori,
        status
    } = body;

    // const voucherId = nanoid(16);
    const createdAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;

    const SQLQuery = `
        INSERT INTO voucher (id, nama, foto, kategori, status, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
        voucherId,
        nama || null,
        foto || null,
        kategori || null,
        status || 'unclaim',
        createdAt,
        updatedAt
    ];

    return dbPool.execute(SQLQuery, values);
};



const getVoucherById = async (id) => {
    if (typeof id === 'undefined') {
        throw new Error('ID tidak boleh undefined');
    }

    const SQLQuery = 'SELECT * FROM voucher WHERE id = ?';
    const [rows, _] = await dbPool.execute(SQLQuery, [id]);

    if (rows.length === 0) {
        throw new Error('Voucher tidak ditemukan');
    }

    return rows[0];
};


/** 
 * Function to update a voucher 
 */
const updateVoucher = async (voucherData) => {
    const {
        id,
        nama,
        foto,
        kategori,
        status,
        token
    } = voucherData;

    const updatedAt = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    const SQLQuery = `
        UPDATE voucher 
        SET nama = ?, foto = ?, kategori = ?, status = ?, updatedAt = ? 
        WHERE id = ?;
    `;
    const [result] = await dbPool.execute(SQLQuery, [
        nama || null,
        foto || null,
        kategori || null,
        status || 'unclaim',
        updatedAt,
        id
    ]);

    if (result.affectedRows === 0) {
        throw new Error('Voucher tidak ditemukan');
    }

    return { message: 'Voucher berhasil diperbaharui' };
};

/** 
 * Function to delete a voucher 
 */
const deleteClaimedVoucher = async (id) => {
    

    const SQLQueryDeleteVoucherClaimed = 'DELETE FROM voucher_claim WHERE id_voucher = ?;';
    const [resultDelete] = await dbPool.execute(SQLQueryDeleteVoucherClaimed, [id]);

    if (resultDelete.affectedRows === 0) {
        throw new Error('Voucher tidak ditemukan');
    }

    const SQLQueryUpdateToUnclaim = `
        UPDATE voucher 
        SET status = "unclaim"  WHERE id = ?;
    `;
    const [resultUpdate] = await dbPool.execute(SQLQueryUpdateToUnclaim, [id]);

    if (resultUpdate.affectedRows === 0) {
        throw new Error('Voucher tidak ditemukan atau sudah dalam status yang diinginkan');
    }
    return { message: 'Voucher berhasil diremove' };
};

// Function to get all claimed vouchers
const getClaimedVouchers = (category) => {
    let SQLQuery = `
        SELECT 
            id, 
            nama, 
            CONCAT("http://localhost:4000/assets/", foto) AS foto, 
            kategori, 
            status 
        FROM voucher 
        WHERE status = 'claim'
    `;
    
    if (category) {
        SQLQuery += ` AND kategori = ?`;
    }

    return dbPool.execute(SQLQuery, [category].filter(Boolean)); 
};


const getUnclaimedVouchers = (category) => {
    let SQLQuery = `
        SELECT 
            id, 
            nama, 
            CONCAT("http://localhost:4000/assets/", foto) AS foto, 
            kategori, 
            status 
        FROM voucher 
        WHERE status = 'unclaim'
    `;
    
    if (category) {
        SQLQuery += ` AND kategori = ?`;
    }

    return dbPool.execute(SQLQuery, [category].filter(Boolean)); 
};


const updateVoucherStatus = async (id) => {

    const SQLQuery = `
        UPDATE voucher 
        SET status = "claim"  WHERE id = ?;
    `;
    const [result] = await dbPool.execute(SQLQuery, [id]);

    if (result.affectedRows === 0) {
        throw new Error('Voucher tidak ditemukan atau sudah dalam status yang diinginkan');
    }

    const insertSQL = `
            INSERT INTO voucher_claim (id_voucher, tanggal_claim) 
            VALUES (?, ?);
        `;
     const tanggalClaim = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const [resultInsert] = await dbPool.execute(insertSQL, [id, tanggalClaim]);
    if (resultInsert.affectedRows === 0) {
        throw new Error('gagal menambahkan data claim voucher');
    }
    return { message: 'Status voucher berhasil diperbaharui' };
};


module.exports = {
    getAllVouchers,
    createNewVoucher,
    getVoucherById,
    updateVoucher,
    deleteClaimedVoucher,
    getUnclaimedVouchers,
    getClaimedVouchers,
    updateVoucherStatus
};
