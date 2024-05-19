require('dotenv').config()

const PORT = process.env.PORT || 5000;
const express = require('express');
const usersRoutes = require('./routes/users');
const middlewareLogRequest = require('./middleware/logs');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const upload = require('./middleware/multer');
const customerModel = require('./models/customers');
const userModel = require('./models/users');
const sellerModel = require('./models/sellers');
const adminModel = require('./models/admins');
const foodModel = require('./models/foods');
const orderModel = require('./models/orders');
const cityModel = require('./models/cities');
const provinceModel = require('./models/provincies');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareLogRequest);
    app.use('/assets', express.static('public/images'))

app.use('/users', usersRoutes);
app.post('/usersCreate', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.filename; 
        }
        const userData = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            photo: imagePath // Simpan nama file foto ke database
        };
        await userModel.createNewUser(userData);
        res.status(201).json({ message: 'User berhasil ditambahkan' });
    } catch (error) {
        next(error); // Lewatkan error ke middleware error handling
    }
});


app.post('/upload',upload.single('photo'),(req, res) => {
    res.json({
        message: 'Upload berhasil'
    });
});



// Foods
// Buat data makanan
app.post('/createFood', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
            const newFilePath = path.join(__dirname, '../public/images', newFileName);

            fs.renameSync(req.file.path, newFilePath);
            imagePath = newFileName;
        }
        const foodData = {
            seller_id: req.body.seller_id,
            seller_city_id: req.body.seller_city_id,
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            expireDate: req.body.expireDate,
            pickUpTimeStart: req.body.pickUpTimeStart,
            pickUpTimeEnd: req.body.pickUpTimeEnd,
            photo: imagePath,
            token: req.headers.authorization 
        };
        await foodModel.createNewFood(foodData);
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil Membuat Data Makanan'
         });
    } catch (error) {
        next(error); 
    }
});

// ambil semua data makanan
app.get('/getAllFoods', async (req, res, next) => {
    try {

        const [foods] = await foodModel.getAllFoods();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Makanan',
            foods: foods
        });
    } catch (error) {
        next(error);
    }
});
// ambil semua daya makanan status ready(true)
app.get('/getReadyFoods', async (req, res, next) => {
    try {

        const [foods] = await foodModel.getReadyFoods();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Makanan Yang Ready',
            foods: foods
        });
    } catch (error) {
        next(error);
    }
});
// ambil semua daya makanan status unready(false)
app.get('/getUnReadyFoods', async (req, res, next) => {
    try {

        const [foods] = await foodModel.getUnReadyFoods();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Makanan Yang Tidak Tersedia',
            foods: foods
        });
    } catch (error) {
        next(error);
    }
});
// ambil data makanan berdasarkan Id
app.get('/getFoodById', async (req, res, next) => {
    try {
        const foodId = req.body.id;
        const food = await foodModel.getFoodById(foodId);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mendapatkan Data Makanan',
            food: food
        });
    } catch (error) {
        next(error);
    }
});

app.get('/getFoodBySellerId', async (req, res, next) => {
    try {
        const getFoodBySellerId = req.body.seller_id;
        const [food] = await foodModel.getFoodBySellerId(getFoodBySellerId);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mendapatkan Data Makanan Berdasarkan Seller Id',
            food: food
        });
    } catch (error) {
        next(error);
    }
});
// hapus makanan
app.delete('/deleteFood', async (req, res, next) => {
    try {
        const foodData = {
            id: req.body.id,
            seller_id: req.body.seller_id,
            token: req.headers.authorization 
        };
        await foodModel.deleteFood(foodData);
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil Menghapus Data Makanan'
         });
    } catch (error) {
        next(error); 
    }
});
// update makanan
app.put('/updateFood', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
            const newFilePath = path.join(__dirname, '../public/images', newFileName);

            fs.renameSync(req.file.path, newFilePath);
            imagePath = newFileName;
        }

        const foodData = {
            id: req.body.id,
            seller_id: req.body.seller_id,
            status: req.body.status,
            description: req.body.description,
            expireDate: req.body.expireDate,
            token: req.headers.authorization,
            price: req.body.price,
            stock: req.body.stock,
            name: req.body.name,
            pickUpTimeStart: req.body.pickUpTimeStart,
            pickUpTimeEnd: req.body.pickUpTimeEnd,
            photo: imagePath
        };

        const result = await foodModel.updateFood(foodData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});



// ORDER FOOD
app.post('/orderFood', async (req, res, next) => {
    try {
        const dataOrder = {
            food_id: req.body.food_id,
            seller_id: req.body.seller_id,
            customer_id: req.body.customer_id,
            amount: req.body.amount,
            token: req.headers.authorization
        };

        if (!dataOrder.food_id || !dataOrder.customer_id || !dataOrder.amount || !dataOrder.seller_id  ) {
            throw new Error('Semua Kolom Wajib Di Isi!!!');
        }
        
        await orderModel.createNewOrder(dataOrder);
        res.status(201).json({ message: 'Order Food Berhasil Sedang Menunggu Konfirmasi Toko' });
    } catch (error) {
        next(error); 
    }
});
// ambil semua data orders
app.get('/getAllOrders', async (req, res, next) => {
    try {

        const [orders] = await orderModel.getAllOrders();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Orders',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});
// ambil data order berdasarkan seller id
app.get('/getOrdersBySellerId', express.json(), async (req, res, next) => {
    try {
        const seller_id = req.body.seller_id; 
        const [orders] = await orderModel.getOrdersBySellerId(seller_id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Orders Berdasarkan Seller Id',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});
// ambil data order berdasarkan customer id
app.get('/getOrdersByCustomerId', express.json(), async (req, res, next) => {
    try {
        const customer_id = req.body.customer_id; 
        const [orders] = await orderModel.getOrdersByCustomerId(customer_id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Orders Berdasarkan Customer Id ',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});
// ambil data order berdasarkan food id
app.get('/getOrdersByFoodId', express.json(), async (req, res, next) => {
    try {
        const food_id = req.body.food_id; 
        const [orders] = await orderModel.getOrdersByFoodId(food_id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Orders Berdasarkan Food Id ',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});
// ambil data order berdasarkan order id
app.get('/getOrdersByOrderId', express.json(), async (req, res, next) => {
    try {
        const order_id = req.body.order_id; 
        const [orders] = await orderModel.getOrdersByOrderId(order_id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Orders Berdasarkan Order Id ',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});

app.get('/checkNewOrder', express.json(), async (req, res, next) => {
    try {
        const seller_id = req.body.seller_id; 
        const [orders] = await orderModel.checkNewOrder(seller_id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Order Baru masuk ',
            orders: orders
        });
    } catch (error) {
        next(error);
    }
});

app.put('/updateOrderToDiproses', express.json(), async (req, res, next) => {
    try {
        const updateData = {
            order_id: req.body.order_id,
            seller_id: req.body.seller_id,
            token: req.headers.authorization,
        };
        const result = await orderModel.updateOrderToDiproses(updateData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});



// ambil semua data city
app.get('/cityAll', async (req, res, next) => {
    try {

        const [cities] = await cityModel.getAllCities();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Kota',
            cities: cities
        });
    } catch (error) {
        next(error);
    }
});
// ambil data city berdasarkan id
app.get('/cityById', express.json(), async (req, res, next) => {
    try {
        const id = req.query.id; 
        const city = await cityModel.getCityById(id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Kota Berdasarkan Provinsi',
            city: city
        });
    } catch (error) {
        next(error);
    }
});
// ambil data city berdasarkan province id
app.get('/cityByProvinceId', express.json(), async (req, res, next) => {
    try {
        const provinceId = req.query.provinceId; 
        const cities = await cityModel.getCityByProvinceId(provinceId);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Kota Berdasarkan Provinsi',
            cities: cities
        });
    } catch (error) {
        next(error);
    }
});
// ambil semua data province
app.get('/provinceAll', async (req, res, next) => {
    try {

        const [provincies] = await provinceModel.getAllProvincies();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Provinsi',
            provincies: provincies
        });
    } catch (error) {
        next(error);
    }
});
// ambil data province berdasarkan id
app.get('/provinceById', express.json(), async (req, res, next) => {
    try {
        const id = req.query.id; 
        const province = await provinceModel.getProvinceById(id);
        res.status(200).json({
            status: 200,
            message: 'Berhasil Mengambil Data Provinsi Berdasarkan Id',
            province: province
        });
    } catch (error) {
        next(error);
    }
});


// ADMIN
// Registrasi Admin
app.post('/adminRegist', async (req, res, next) => {
    try {
        const dataAdmin = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            provinceId: req.body.provinceId,
            cityId: req.body.cityId,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };

        if (!dataAdmin.email || !dataAdmin.password || !dataAdmin.name || !dataAdmin.address || !dataAdmin.latitude || !dataAdmin.longitude) {
            throw new Error('Semua Kolom Wajib Di Isi!!!');
        }
        
        await adminModel.createNewAdmin(dataAdmin);
        res.status(201).json({ status: '200', message: 'Registrasi Admin Berhasil' });
    } catch (error) {
        next(error); 
    }
});

// CUSTOMER
// buat akun customer
app.post('/createCustomer', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
            const newFilePath = path.join(__dirname, '../public/images', newFileName);

            fs.renameSync(req.file.path, newFilePath);

            imagePath = newFileName;
            // imagePath = req.file.filename; 
        }
        const userCustomerData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
            photo: imagePath,

            name: req.body.name,
            nomorWA: req.body.nomorWA,
            address: req.body.address,
            city_id: req.body.city_id,
            city_province_id: req.body.city_province_id

        };
        await customerModel.createNewCustomer(userCustomerData);
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil Membuat Akun Customer'
         });
    } catch (error) {
        next(error); 
    }
});
// login akun customer
app.post('/loginCustomer', async (req, res, next) => {
    try {
        const dataMasuk = {
            email: req.body.email,
            password: req.body.password
        };

        if (!dataMasuk.email || !dataMasuk.password) {
            throw new Error('Email dan password harus diisi');
        }
        console.log(dataMasuk);
        const token = await customerModel.authenticateCustomer(dataMasuk);
        const customerData = await customerModel.getCustomerByEmail(dataMasuk.email);

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            data: {
                id_cust: customerData.id_cust,
                customer_name: customerData.customer_name,
                nomorWA: customerData.nomorWA,
                address: customerData.address,
                city_id: customerData.city_id,
                city_province_id: customerData.city_province_id,
                user_id: customerData.user_id,
                username: customerData.username,
                email: customerData.email,
                role: customerData.role,
                createdAt: customerData.createdAt,
                updatedAt: customerData.updatedAt,
                photo: customerData.photo
            }
        });
    } catch (error) {
        next(error); 
    }
});
// ambil semua data customers
app.get('/getAllCustomers', async (req, res, next) => {
    try {

        const [customers] = await customerModel.getAllCustomers();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Customer',
            customers: customers
        });
    } catch (error) {
        next(error);
    }
});


// SELLER
// buat akun seller
app.post('/createSeller', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
            const newFilePath = path.join(__dirname, '../public/images', newFileName);

            fs.renameSync(req.file.path, newFilePath);

            imagePath = newFileName;
            // imagePath = req.file.filename; 
        }
        const userSellerData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
            photo: imagePath,

            name: req.body.name,
            nomorWA: req.body.nomorWA,
            desc: req.body.desc,
            address: req.body.address,
            city_id: req.body.city_id,
            city_province_id: req.body.city_province_id

        };
        await sellerModel.createNewSeller(userSellerData);
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil Membuat Akun Seller'
         });
    } catch (error) {
        next(error); 
    }
});
// Login Seller
app.post('/loginSeller', async (req, res, next) => {
    try {
        const reqDataLogin = {
            email: req.body.email,
            password: req.body.password
        };

        if (!reqDataLogin.email || !reqDataLogin.password) {
            throw new Error('Email dan password harus diisi');
        }
        
        const token = await sellerModel.authenticateSeller(reqDataLogin);
        const sellerData = await sellerModel.getSellerByEmail(reqDataLogin.email);

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            data: {
                id_seller: sellerData.id_seller,
                name: sellerData.name,
                desc: sellerData.desc,
                nomorWA: sellerData.nomorWA,
                address: sellerData.address,
                city_id: sellerData.city_id,
                city_province_id: sellerData.city_province_id,
                user_id: sellerData.user_id,
                username: sellerData.username,
                email: sellerData.email,
                role: sellerData.role,
                createdAt: sellerData.createdAt,
                updatedAt: sellerData.updatedAt,
                photo: sellerData.photo
            }
        });
    } catch (error) {
        next(error); 
    }
});
//  ambil semua data seller
app.get('/getAllSellers', async (req, res, next) => {
    try {

        const [customers] = await sellerModel.getAllSellers();
        res.status(201).json({
            status: 200,
            message: 'Berhasil Mengambil Semua Data Seller',
            customers: customers
        });
    } catch (error) {
        next(error);
    }
});

// ADMIN
// buat akun admin
app.post('/createAdmin', upload.single('photo'), async (req, res, next) => {
    try {
        let imagePath = null;
        if (req.file) {
            const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
            const newFilePath = path.join(__dirname, '../public/images', newFileName);

            fs.renameSync(req.file.path, newFilePath);

            imagePath = newFileName;
            // imagePath = req.file.filename; 
        }
        const userDataAdmin = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
            photo: imagePath,

        };
        await adminModel.createNewAdmin(userDataAdmin);
        res.status(201).json({ 
            status: 200,
            message: 'Berhasil Membuat Akun Admin'
         });
    } catch (error) {
        next(error); 
    }
});
// Login Admin
app.post('/loginAdmin', async (req, res, next) => {
    try {
        const reqDataLogin = {
            email: req.body.email,
            password: req.body.password
        };

        if (!reqDataLogin.email || !reqDataLogin.password) {
            throw new Error('Email dan password harus diisi');
        }
        
        const token = await adminModel.authenticateAdmin(reqDataLogin);
        const adminData = await adminModel.getAdminByEmail(reqDataLogin.email);

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            data: {
                user_id: adminData.user_id,
                username: adminData.username,
                email: adminData.email,
                password: adminData.password,
                role: adminData.role,
                createdAt: adminData.createdAt,
                updatedAt: adminData.updatedAt,
                photo: adminData.photo
            }
        });
    } catch (error) {
        next(error); 
    }
});

app.post('/login', async (req, res, next) => {
    try {
        const reqDataLogin = {
            email: req.body.email,
            password: req.body.password
        };

        if (!reqDataLogin.email || !reqDataLogin.password) {
            throw new Error('Email dan password harus diisi');
        }
        
        const token = await userModel.authenticateUser(reqDataLogin);
        
        let userData;
        const dataUser = await userModel.checkRoleUserByEmail(reqDataLogin.email);;
        let role = dataUser.role;

        // Mengecek peran pengguna
        switch (role) {
            case 'customer':
                const customerUserData = await userModel.getCustomerDataById(dataUser.user_id);
                if (!customerUserData) {
                    throw new Error('Data customer tidak ditemukan');
                }
                userData = customerUserData;
                break;
            case 'seller':
                const sellerUserData = await userModel.getSellerDataById(dataUser.user_id);
                if (!sellerUserData) {
                    throw new Error('Data seller tidak ditemukan');
                }
                userData = sellerUserData;
                break;
            case 'admin':
                const adminUserData = await userModel.getAdminDataById(dataUser.user_id);
                if (!adminUserData) {
                    throw new Error('Data admin tidak ditemukan');
                }
                userData = adminUserData;
                break;
            default:
                throw new Error('Peran pengguna tidak valid');
        }

        // Mengembalikan data sesuai dengan peran pengguna
        let responseData;
        switch (role) {
            case 'customer':
                responseData = {
                    id_cust: userData.id_cust,
                    customer_name: userData.customer_name,
                    nomorWA: userData.nomorWA,
                    address: userData.address,
                    city_id: userData.city_id,
                    city_province_id: userData.city_province_id,
                    user_id: userData.user_id,
                    username: userData.username,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                    photo: userData.photo
                };
                break;
            case 'seller':
                responseData = {
                    id_seller: userData.id_seller,
                    name: userData.name,
                    desc: userData.desc,
                    nomorWA: userData.nomorWA,
                    address: userData.address,
                    city_id: userData.city_id,
                    city_province_id: userData.city_province_id,
                    user_id: userData.user_id,
                    username: userData.username,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                    photo: userData.photo
                };
                break;
            case 'admin':
                responseData = {
                    user_id: userData.user_id,
                    username: userData.username,
                    email: userData.email,
                    password: userData.password, 
                    role: userData.role,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                    photo: userData.photo
                };
                break;
            default:
                throw new Error('Peran pengguna tidak valid');
        }

        res.status(200).json({
            message: 'Login berhasil',
            token: token,
            data: responseData
        });
    } catch (error) {
        next(error); 
    }
});





app.use((err, req, res, next) => {
    res.json({
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`Server berhasil di running di port ${PORT}`);
})