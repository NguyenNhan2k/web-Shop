const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const Category = new Schema(
    {
        id_product: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        name: { type: String, required: true },
        deleteBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);
Category.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ name: req.query.slug });
    }
    return this;
};
Category.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
Category.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Category.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Category', Category);
