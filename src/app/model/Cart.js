const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Size' },
        quantity: { type: Number, default: 0, require: true },
        id_customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Cart', Cart);
