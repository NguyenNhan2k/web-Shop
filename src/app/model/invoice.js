const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');

const Invoice = new Schema(
    {
        id_order: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
        id_staff: { type: Schema.Types.ObjectId, ref: 'User' },
        total_money: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    },
);
Invoice.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Invoice', Invoice);
