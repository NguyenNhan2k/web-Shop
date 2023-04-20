const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatusProduct = new Schema(
    {
        name: { type: String, require: true },
        id_product: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        createBy: { type: Schema.Types.ObjectId, ref: 'User' },
        updateBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        deleteBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('StatusProduct', StatusProduct);
