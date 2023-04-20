const Products = require('../model/Products');
const Category = require('../model/Category');
const Rate = require('../model/Rate');
const Cart = require('../model/Cart');

const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
class HomeController {
    async index(req, res) {
        try {
            const categories = await Category.find({});
            const searchProduct = await Products.find({});
            const pagingProduct = await Products.count({});
            const SIZE_PAGE = await res.locals._page.pageSize;
            let countCart = await 0;
            if (req.user) {
                countCart = await Cart.count({ id_customer: req.user.id });
            }
            req.session.countCart = await countCart;
            const countPaging = Math.ceil(pagingProduct / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            const products = await Products.find({})
                .search(req)
                .populate('size')
                .filter(req)
                .sortable(req)
                .paginal(req, res);
            return res.render('shop/home', {
                layout: 'main',
                products: mutipleMongooseToObject(products),
                searchProduct: mutipleMongooseToObject(searchProduct),
                categories: mutipleMongooseToObject(categories),
                paging,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async showDetail(req, res) {
        try {
            const productReq = await req.params.slug;
            const product = await Products.findOne({ slug: productReq }).populate([
                {
                    path: 'size',
                    model: 'Size',
                },
                {
                    path: 'rate',
                    model: 'Rate',
                    populate: {
                        path: 'id_user',
                        model: 'Customer',
                    },
                },
            ]);
            const rate = await Rate.count({ id_product: product._id });
            const countViews = (await product.viewsCount) + 1;
            const saveViews = await Products.updateOne({ _id: product._id }, { $set: { viewsCount: countViews } });
            return res.render('shop/showDetailProduct', {
                layout: 'main',
                product: mongooseToObject(product),
                rate,
            });
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new HomeController();
