const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Receipt = new Schema(
    {
        id_ReceiptInfo: [{ type: Schema.Types.ObjectId, ref: 'ReceiptInfo' }],
        name: { type: String, required: true },
        createBy: { type: Schema.Types.ObjectId, ref: 'User' },
        deleteBy: { type: Schema.Types.ObjectId, ref: 'User' },
        total_money: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    },
);
Receipt.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ name: req.query.slug });
    }
    return this;
};
Receipt.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};

Receipt.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Receipt.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Receipt', Receipt);
