const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');

const StatusOrder = new Schema(
    {
        name: { type: String, require: true },
        order: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        deleteBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);
StatusOrder.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
StatusOrder.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
StatusOrder.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('StatusOrder', StatusOrder);
