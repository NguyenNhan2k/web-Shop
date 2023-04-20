const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');

const Supplier = new Schema(
    {
        name: { type: String, require: true },
        phone: { type: String, require: true },
        address: { type: String, require: true },
        email: { type: String, require: true },
        createBy: { type: Schema.Types.ObjectId, ref: 'User' },
        updateBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        deleteBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        id_receiptInfo: [{ type: Schema.Types.ObjectId, ref: 'ReceiptInfo' }],
    },
    {
        timestamps: true,
    },
);
Supplier.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
Supplier.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Supplier.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Supplier', Supplier);
