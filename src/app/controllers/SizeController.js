const Size = require('../model/Size');
const Cart = require('../model/Cart');
const ReceiptInfo = require('../model/ReceiptInfo');
const Products = require('../model/Products');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

class SizeController {
    async showSizeProduct(req, res, next) {
        try {
            const product = await Size.find({}).paginal(req, res).populate('id_product').sortable(req);
            const countSize = await Size.countDeleted({});
            const pagingSize = await Size.count({});
            const SIZE_PAGE = await res.locals._page.pageSize;
            const countPaging = await Math.ceil(pagingSize / SIZE_PAGE);
            const paging = await [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = (await i) + 1;
            }
            return res.render('staff/showSizeSP', {
                layout: 'staff',
                product: mutipleMongooseToObject(product),
                countSize,
                paging,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async showDetailSize(req, res, next) {
        const valueReq = await req.params.slug;
        const size = await Size.findById({ _id: valueReq });
        try {
            res.render('staff/showDetailSize', {
                layout: 'staff',
                size: mongooseToObject(size),
            });
        } catch (error) {
            res.render('staff/showDetailSize', {
                layout: 'staff',
                nameSize: valueReq,
                message: {
                    message: 'Xảy ra lỗi, vui lòng thử lại!',
                    type: 'warning',
                },
            });
        }
    }
    async showCreateSizeProduct(req, res, next) {
        try {
            const product = await Products.find({});
            res.render('staff/createSize', {
                layout: 'staff',
                product: mutipleMongooseToObject(product),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async showTrash(req, res, next) {
        try {
            const countSize = await Size.countDeleted({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(countSize / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            const sizes = await Size.findDeleted({})
                .paginal(req, res)
                .sortable(req)
                .populate([
                    {
                        path: 'id_product',
                        model: 'Product',
                    },
                    {
                        path: 'deletedBy',
                        model: 'User',
                    },
                ]);
            return res.status(200).render('staff/showTrashSize', {
                layout: 'staff',
                sizes: mutipleMongooseToObject(sizes),
                paging,
            });
        } catch (err) {}
    }
    async addSizeProduct(req, res, next) {
        const reqSize = await req.body;
        await reqSize.name.trim();
        const product = await Products.findOne({ _id: reqSize.id_product }).populate('size');
        try {
            const sizeProduct = await new Size({
                id_product: reqSize.id_product,
                name: reqSize.name,
            });
            console.log(reqSize.id_product);
            for (let i = 0; i < product.size.length; i++) {
                if (product.size[i].name === reqSize.name) {
                    req.session.message = {
                        message: 'Trùng size sản phẩm !',
                        type: 'warning',
                    };
                    return res.redirect('back');
                }
            }
            sizeProduct.save();
            if (product) {
                await Products.updateOne({ _id: reqSize.id_product }, { $push: { size: sizeProduct._id } });
                req.session.message = {
                    message: 'Thêm size sản phẩm thành công!',
                    type: 'success',
                };
                return res.redirect('back');
            }
        } catch (error) {
            req.session.message = {
                message: 'Thêm size sản phẩm thất bại!',
                type: 'warning',
            };
            return res.redirect('/sizeProduct/createSize');
        }
    }
    async updateSize(req, res) {
        try {
            const { name, id_size, description } = await req.body;
            const { id, roles } = await req.userStaff;
            const size = await Size.findById(id_size);
            const idProduct = await Size.find({ id_product: size.id_product });
            const getIndex = idProduct.map((size) => size.name).indexOf(size.name);
            if (size) {
                for (let i = 0; i < idProduct.length; i++) {
                    if (i == getIndex) {
                        continue;
                    }
                    if (idProduct[i].name === name) {
                        req.session.message = await {
                            message: 'Thất bại. Trùng sản phẩm !',
                            type: 'warning',
                        };
                        return res.redirect(`/sizeProduct/${size._id}`);
                    }
                }
                size.name = name;
                size.description = description.trim();
                await size.save();
                await Size.updateOne({ _id: size._id }, { $push: { updateBy: id } });
                req.session.message = await {
                    message: 'Cập nhập thành công !',
                    type: 'success',
                };
                return res.redirect(`/sizeProduct/${size._id}`);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = await req.params.slug;
            const { id, rolse } = await req.userStaff;
            const result = await Size.delete({ _id: reqId });
            if (result) {
                await Size.updateOneDeleted({ _id: reqId }, { deletedBy: id });
                req.session.message = await {
                    message: 'Xóa thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Xóa thất bại !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async forceDestroy(req, res) {
        try {
            const reqId = await req.params.slug;
            const size = await Size.findOneDeleted({ _id: reqId });
            if (size) {
                // Xóa id size ra array sản phẩm
                await Products.updateOne({ _id: size.id_product }, { $pull: { size: size._id } });
                // Xóa id size ra cart
                await Cart.deleteOne({ product: size._id });
                // Xóa size ra receiptInfo
                // 1. tìm obj receiptInfo
                const receiptInfo = await // Xóa Size
                await Size.deleteOne({ _id: size._id });
                req.session.message = await {
                    message: 'Xóa thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Xóa thất bại !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await Size.restore({ _id: reqId });
            if (result) {
                req.session.message = await {
                    message: 'Khôi phục thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Khôi phục thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        } catch (err) {
            req.session.message = await {
                message: 'Khôi phục thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = await req.body.action;
            const sizes = (await Array.isArray(req.body.sizes)) ? req.body.sizes : [req.body.sizes];
            switch (action) {
                case 'delete':
                    const resultOne = await Size.delete({ _id: { $in: sizes } });
                    for (let size of sizes) {
                        await Size.updateOneDeleted({ deletedBy: size }, { deletedBy: req.userStaff.id });
                    }
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Size.restore({ _id: { $in: sizes } });
                    console.log(sizes);
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    req.session.message = await {
                        message: 'Khôi phục thất bại !',
                        type: 'warning',
                    };
                    return await res.redirect(`back`);
                    break;
                case 'force':
                    const Sizes = await Size.findDeleted({ _id: { $in: sizes } });
                    if (Sizes) {
                        for (let size of Sizes) {
                            await Products.updateOne({ _id: size.id_product }, { $pull: { size: size._id } });
                            await Size.deleteOne({ _id: size._id });
                            await Cart.deleteOne({ product: size._id });
                        }
                        req.session.message = await {
                            message: 'Xóa thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    } else {
                        req.session.message = await {
                            message: 'Xóa thất bại !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                default:
                    req.session.message = await {
                        message: 'Xóa thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
            }
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new SizeController();
