const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const User = new Schema(
    {
        name: { type: String, require: true },
        address: { type: String, require: true },
        email: { type: String, require: true },
        phone: { type: String, require: true },
        password: { type: String, require: true },
        roles: { type: String, default: 'staff' },
        images: { type: String, default: 'user.png' },
    },
    {
        timestamps: true,
    },
);
User.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
User.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
User.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ slug: req.query.slug });
    }
    return this;
};
User.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('User', User);
