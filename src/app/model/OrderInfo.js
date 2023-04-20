const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderInfo = new Schema(
    {
        id_order: { type: Schema.Types.ObjectId, ref: 'Order' },
        id_Size: { type: Schema.Types.ObjectId, ref: 'Size' },
        export_price: { type: Number, default: 0, required: true },
        quantity: { type: Number, default: 0, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('OrderInfo', OrderInfo);
