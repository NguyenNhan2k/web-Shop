const Products = require('../model/Products');
const Category = require('../model/Category');
const Rate = require('../model/Rate');

const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
class RateController {
    async index(req, res) {
        try {
        } catch (err) {
            console.log(err);
        }
    }
    async rate(req, res, next) {
        try {
            const { rate, comment } = await req.body;
            const idProduct = await req.params.id;
            if (!req.user) {
                req.session.message = await {
                    message: 'Vui lòng đăng nhập để đánh giá !',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
            const isNull = (await rate) && comment ? true : false;
            if (!isNull) {
                req.session.message = await {
                    message: 'Vui lòng không để trống !',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
            if (!idProduct) {
                req.session.message = await {
                    message: 'Đánh giá sản phẩm thất bại !',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
            const { id, roles } = await req.user;

            const newRate = await new Rate({
                id_user: id,
                id_product: idProduct,
                rate: parseInt(rate),
                comment,
            });
            await newRate.save();
            await Products.updateOne({ _id: idProduct }, { $push: { rate: newRate._id } });
            req.session.message = await {
                message: 'Đánh giá sản phẩm thành công !',
                type: 'success',
            };
            return await res.redirect(`back`);
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Đánh giá sản phẩm thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
}
module.exports = new RateController();
