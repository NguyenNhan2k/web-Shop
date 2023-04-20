const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const ReceiptInfo = new Schema(
    {
        id_Receipt: { type: Schema.Types.ObjectId, ref: 'Receipt' },
        id_Size: { type: Schema.Types.ObjectId, ref: 'Size' },
        id_Supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
        count: { type: Number, require: true },
        export_price: { type: Number, require: true },
        total_money: { type: Number, require: true, default: 0 },
        deleteBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    },
);
ReceiptInfo.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};

ReceiptInfo.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
ReceiptInfo.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('ReceiptInfo', ReceiptInfo);
