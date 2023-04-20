const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const Customer = new Schema(
    {
        name: { type: String, require: true },
        address: { type: String, require: true },
        email: { type: String, require: true },
        phone: { type: String, require: true },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        password: { type: String, require: true },
        roles: { type: String, default: 'user' },
        images: { type: String, default: 'user.png' },
    },
    {
        timestamps: true,
    },
);
Customer.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
Customer.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ _id: req.query.slug });
    }
    return this;
};
Customer.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Customer.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Customer', Customer);
