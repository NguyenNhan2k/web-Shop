const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const Order = new Schema(
    {
        id_orderInfo: [{ type: Schema.Types.ObjectId, ref: 'OrderInfo' }],
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        totalPrice: { type: Number, default: 0, require: true },
        status: { type: Schema.Types.ObjectId, ref: 'StatusOrder', default: null },
        id_user: { type: Schema.Types.ObjectId, ref: 'Customer' },
        confirmBy: { type: Schema.Types.ObjectId, ref: 'User' },
        deleteBy: { type: Schema.Types.ObjectId, ref: 'User' },
        date_ship: { type: Date },
    },
    {
        timestamps: true,
    },
);
Order.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
Order.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Order.query.selectProduct = function (req) {
    if (req.query.products) {
        const reqProduct = req.query.products;
        const productsArr = Array.isArray(reqProduct) ? reqProduct : [reqProduct];
        return this.find({ _id: { $in: productsArr } });
    }
    return this;
};
Order.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ slug: req.query.slug });
    }
    return this;
};
Order.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Order', Order);
