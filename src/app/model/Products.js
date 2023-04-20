const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Product = new Schema(
    {
        title: { type: String, required: true },
        export_price: { type: Number, required: true },
        size: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Size',
            },
        ],
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        unit: { type: String, required: true },
        description: { type: String, required: true },
        sale: { type: Number, default: 0 },
        img: { type: Array, required: true },
        slug: { type: String, slug: 'title' },
        viewsCount: { type: Number, default: 0 },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: 'null',
        },
        rate: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Rate',
            },
        ],
        status: { type: Schema.Types.ObjectId, ref: 'StatusProduct', default: null },
    },
    {
        timestamps: true,
    },
);
Product.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'decs'].includes(req.query.type);
        return this.sort({ [req.query.column]: isValidType ? req.query.type : 'desc' });
    }
    return this;
};
Product.query.search = function (req) {
    if (req.query.hasOwnProperty('_search')) {
        return this.find({ slug: req.query.slug });
    }
    return this;
};
Product.query.paginal = function (req, res) {
    const SIZE_PAGE = res.locals._page.pageSize;
    const reqPage = req.query._page || 1;
    let page = parseInt(reqPage);
    if (req.query.hasOwnProperty('_page')) {
        return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
    }
    return this.skip(SIZE_PAGE * page - SIZE_PAGE).limit(SIZE_PAGE);
};
Product.query.filter = function (req) {
    if (req.query.hasOwnProperty('_filter')) {
        const typeFilter = req.query.type;
        const valueFilter = req.query.value;
        if (typeFilter === 'price') {
            const [min, max] = valueFilter.split(':');
            return this.find({
                $and: [{ export_price: { $gt: parseInt(min) } }, { export_price: { $lte: parseInt(max) } }],
            });
        }
        if (typeFilter === 'category') {
            return this.find({ category: valueFilter });
        }
        if (typeFilter === 'size') {
            console.log(this);
            return this.find({ size: { $elemMatch: { name: valueFilter } } });
        }
    }
    return this;
};
Product.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Product', Product);
