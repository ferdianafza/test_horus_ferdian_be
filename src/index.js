require('dotenv').config()

const PORT = process.env.PORT || 5000;
const express = require('express');
const usersRoutes = require('./routes/users');
const middlewareLogRequest = require('./middleware/logs');
const path = require('path');
const fs = require('fs');
const upload = require('./middleware/multer');
const userModel = require('./models/users');
const voucherModel = require('./models/voucher');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareLogRequest);
app.use('/assets', express.static('public/images'));
app.use('/users', usersRoutes);


app.post('/upload',upload.single('photo'),(req, res) => {
    res.json({
        message: 'Upload berhasil'
    });
});

// mengambil voucher berdasarkan id
app.get('/vouchers/:id', async (req, res, next) => {
    try {
        const id = req.params.id; // Ensure this is defined
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'ID voucher tidak diberikan',
            });
        }

        const voucher = await voucherModel.getVoucherById(id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Data Voucher Berdasarkan Id',
            voucher: voucher
        });
    } catch (error) {
        console.error('Error occurred:', error); // Log error for debugging
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil data voucher',
            error: error.message
        });
    }
});
// mengambil semua data voucher
app.get('/vouchers', async (req, res, next) => {
    try {

        const [vouchers] = await voucherModel.getAllVouchers();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Voucher',
            vouchers: vouchers
        });
    } catch (error) {
        next(error);
    }
});


//  mengambil data voucher yang sudah diclaim
app.get('/vouchersclaim', async (req, res, next) => {
    try {
        const category = req.query.category; 
        const [vouchers] = await voucherModel.getClaimedVouchers(category); 
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Voucher yang sudah diklaim',
            vouchers: vouchers
        });
    } catch (error) {
        console.error('Error occurred:', error); 
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil data voucher yang sudah diklaim',
            error: error.message
        });
    }
});

// mengambil data voucher yang belum diclaim
app.get('/vouchersunclaim', async (req, res, next) => {
    try {
        const category = req.query.category; 
        const [vouchers] = await voucherModel.getUnclaimedVouchers(category); 
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Voucher yang Belum Diklaim',
            vouchers: vouchers
        });
    } catch (error) {
        console.error('Error occurred:', error); 
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil data voucher yang belum diklaim',
            error: error.message
        });
    }
});

//update voucher status jadi claim
app.put('/vouchers/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'ID voucher tidak diberikan',
            });
        }
        const result = await voucherModel.updateVoucherStatus(id);
        res.status(200).json({
            status: 200,
            message: result.message
        });
    } catch (error) {
        console.error('Error occurred:', error); 
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat memperbaharui status voucher',
            error: error.message
        });
    }
});
// update voucher jadi unclaim
app.delete('/unclaimvoucher', async (req, res, next) => {
    try {
        const id = req.body.id;
        consloe.log(await voucherModel.deleteClaimedVoucher(id));
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil remove voucher'
         });
    } catch (error) {
        next(error); 
    }
});

// USER
// registrasi user

app.use((err, req, res, next) => {
    res.json({
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`Server berhasil di running di port ${PORT}`);
})