const newRouter = require('./news');
const loginRouter = require('./login');
const registerRouter = require('./register');

const adminRouter = require('./admin');
const homeRouter = require('./home');
const staffRouter = require('./staff');
const sizeRouter = require('./size');
const statusRouter = require('./status');
const statusOrderRouter = require('./statusOrder');
const supplierRouter = require('./supplier');
const productRouter = require('./product');
const receiptInfoRouter = require('./receiptInfo');
const receiptRouter = require('./receipt');
const cartRouter = require('./cart');
const customerRouter = require('./customer');
const orderRouter = require('./order');
const rateRouter = require('./rate');
const dashboardRouter = require('./dashboard');
const categoryRouter = require('./category');
const middlewareController = require('../app/controllers/MiddlewareController');
function route(app) {
    app.use('/', middlewareController.verifyUser, homeRouter);
    app.use('/news', newRouter);
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);

    app.use('/admin', adminRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/rate', rateRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/customers', customerRouter);
    app.use('/supplier', middlewareController.verifyStaff, supplierRouter);
    app.use('/receipt', middlewareController.verifyStaff, receiptRouter);
    app.use('/receiptInfo', middlewareController.verifyStaff, receiptInfoRouter);
    app.use('/statusProduct', middlewareController.verifyStaff, statusRouter);
    app.use('/statusOrder', middlewareController.verifyStaff, statusOrderRouter);
    app.use('/staff', middlewareController.verifyStaff, staffRouter);
    app.use('/sizeProduct', middlewareController.verifyStaff, sizeRouter);
    app.use('/category', middlewareController.verifyStaff, categoryRouter);
    app.use('/products', productRouter);
}
module.exports = route;
