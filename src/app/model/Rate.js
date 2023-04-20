const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const Rate = new Schema(
    {
        id_product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        id_user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        rate: { type: Number, default: 5 },
    },
    {
        timestamps: true,
    },
);

Rate.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Rate', Rate);
