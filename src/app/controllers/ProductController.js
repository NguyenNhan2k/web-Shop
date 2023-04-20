const Product = require('../model/Products');
const Status = require('../model/StatusProduct');
const Size = require('../model/Size');
const Rate = require('../model/Rate');
const ReceiptInfo = require('../model/ReceiptInfo');
const OrderInfo = require('../model/OrderInfo');
const Order = require('../model/Order');
const Receipt = require('../model/Receipt');
const Cart = require('../model/Cart');
const Category = require('../model/Category');
var mongoose = require('mongoose');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

var getIndex = (product, products, title) => {
    const indexProduct = products.map((product) => product.title).indexOf(product.title);
    for (let i = 0; i < products.length; i++) {
        if (i == indexProduct) {
            continue;
        }
        if (products[i].title.trim() == title.trim()) {
            return false;
        }
    }
    return true;
};
class ProductController {
    // [GET] / hiển thị trang sản phẩm
    async showProducts(req, res, next) {
        try {
            const categories = await Category.find({});
            const searchProduct = await Product.find({});
            const countProduct = await Product.countDeleted({});
            const pagingProduct = await Product.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingProduct / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            const products = await Product.find({}).search(req).paginal(req, res).sortable(req, res).populate('size');
            return res.status(200).render('staff/products', {
                layout: 'staff',
                product: mutipleMongooseToObject(products),
                searchProduct: mutipleMongooseToObject(searchProduct),
                countProduct,
                categories: mutipleMongooseToObject(categories),
                paging,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // [GET] --> path: /staff/products/create
    async showCreateProducts(req, res, next) {
        try {
            const categories = await Category.find({});
            res.render('staff/createProduct', {
                layout: 'staff',
                categories: mutipleMongooseToObject(categories),
            });
        } catch (error) {
            console.log(error);
        }
    }
    // [GET] --> Path: /staff/products/:slug  < Show Details products >
    async showDetailProduct(req, res, next) {
        try {
            const reqParams = await req.params.slug;
            const statusAll = await Status.find({});
            const productDeleted = await Product.findOneDeleted({ slug: reqParams }).populate([
                {
                    path: 'size',
                    model: 'Size',
                },
                {
                    path: 'status',
                    model: 'StatusProduct',
                },
            ]);

            if (reqParams) {
                const product =
                    productDeleted ||
                    (await Product.findOne({ slug: reqParams }).populate([
                        {
                            path: 'size',
                            model: 'Size',
                        },
                        {
                            path: 'status',
                            model: 'StatusProduct',
                        },
                    ]));
                const nameCategory = await Category.findOne({ _id: product.category });
                const Categories = await Category.find({});
                if (product.img) {
                    var oneImg = await product.img[0];
                    var other = await product.img.slice(1);
                }
                res.render('staff/showDetailProduct', {
                    layout: 'staff',
                    category: mutipleMongooseToObject(Categories),
                    nameCategory: mongooseToObject(nameCategory),
                    product: mongooseToObject(product),
                    status: mutipleMongooseToObject(statusAll),
                    oneImg,
                    other,
                });
            }
        } catch (next) {
            console.log(next);
        }
    }
    async showTrash(req, res, next) {
        try {
            const products = await Product.findDeleted({}).populate('size').populate('deletedBy');
            return res.status(200).render('staff/showTrashProduct', {
                layout: 'staff',
                product: mutipleMongooseToObject(products),
            });
        } catch (err) {
            console.log(err);
        }
    }
    async create(req, res) {
        try {
            const valueReq = await req.body;
            const imgs = await req.files;
            const newImgs = await imgs.map((imgs) => imgs.originalname);
            var categoryId = await valueReq.category;
            if (valueReq) {
                const product = await new Product({
                    title: valueReq.title,
                    export_price: valueReq.export_price,
                    unit: valueReq.unit,
                    description: valueReq.description,
                    img: newImgs,
                    sale: valueReq.sale,
                    category: valueReq.category,
                });
                const productItems = await Product.findOne({ title: valueReq.title }).then((result) => {
                    if (result) {
                        req.session.message = {
                            message: 'Thất bại. Trùng sản phẩm !',
                            type: 'warning',
                        };
                        return res.redirect(`back`);
                    } else {
                        product.save().then((product) => {
                            if (categoryId) {
                                Category.updateOne(
                                    {
                                        _id: categoryId,
                                    },
                                    {
                                        $push: { id_product: product._id },
                                    },
                                ).then((result) => console.log(result));
                            }
                            req.session.message = {
                                message: 'Thêm thành công !',
                                type: 'success',
                            };
                            return res.redirect(`back`);
                        });
                    }
                });
            }
        } catch (error) {
            req.session.message = await {
                message: 'Thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async update(req, res) {
        try {
            const reqProduct = await req.body;
            const reqImg = await req.files;
            const { id, roles } = await req.userStaff;
            const products = await Product.find();
            const product = await Product.findById(reqProduct.id);
            const validProduct = await getIndex(product, products, reqProduct.title); // Kiểm tra trùng tên sản phẩm
            const newImgs = reqImg && (await reqImg.map((imgs) => imgs.originalname));
            console.log(newImgs);
            if (validProduct) {
                // Xóa Id sản phẩm ra danh mục
                const deleteInCategory = await Category.updateOne(
                    { _id: product.category },
                    { $pull: { id_product: product._id } },
                );
                // Xóa Id sản phẩm ra trạng thái
                const deleteInStatus = await Status.updateOne(
                    { _id: product.status },
                    { $pull: { id_product: product._id } },
                );
                product.title = await reqProduct.title;
                product.unit = await reqProduct.unit;
                product.import_price = await reqProduct.import_price;
                product.export_price = await reqProduct.export_price;
                product.status = await reqProduct.status;
                product.description = await reqProduct.description;
                product.sale = await reqProduct.sale;
                product.img = (await newImgs.length) > 0 ? newImgs : product.img;
                product.category = await reqProduct.category;
                await product.save();
                // Đẩy id vao array trạng thái sản phẩm
                await Status.updateOne({ _id: product.status }, { $push: { id_product: product._id } });
                // Update id sản phẩm vào danh mục
                await Category.updateOne({ _id: product.category }, { $push: { id_product: product._id } });
                req.session.message = await {
                    message: 'Update sản phẩm thành công !',
                    type: 'success',
                };
                return res.redirect(`/products/${product.slug}`);
            } else {
                req.session.message = await {
                    message: 'Trùng tên sản phẩm !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            console.log(err);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = await req.params.slug;
            const { id, roles } = await req.userStaff;
            const result = await Product.delete({ _id: reqId });
            await Product.updateOneDeleted({ _id: reqId }, { deletedBy: id });
            if (result) {
                req.session.message = await {
                    message: 'Xóa thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        } catch (err) {
            console.log(err);
        }
    }
    async forceDestroy(req, res, next) {
        try {
            const reqId = await req.params.slug;
            const product = await Product.findOneDeleted({ _id: reqId });
            //Xóa id_product ra danh mục
            const updateCategory = await Category.updateOne({ id_product: reqId }, { $pull: { id_product: reqId } });
            //Xóa id ra document size
            for (const idSize of product.size) {
                // Xóa giỏ hàng
                await Cart.deleteMany({ product: idSize });
                // Xóa Size sản phẩm
                await Size.deleteMany({ id_product: product._id });
                // Xóa receipt info
                const receiptInfo = await ReceiptInfo.find({ id_Size: idSize });
                if (receiptInfo) {
                    for (let idReceiptInfo of receiptInfo) {
                        // Xóa id phiếu nhập chi tiết ra phiếu nhập tổng
                        await Receipt.updateOne(
                            { id_Receipt: idReceiptInfo.id_Receipt },
                            { $pull: { id_ReceiptInfo: idReceiptInfo._id } },
                        );
                        // update tiền của từng phiếu nhập
                        await Receipt.updateOne(
                            { _id: idReceiptInfo.id_Receipt },
                            { $inc: { total_money: -idReceiptInfo.total_money } },
                        );
                        // Xóa phiếu nhập chi tiết
                        await ReceiptInfo.deleteOne({ _id: idReceiptInfo._id });
                    }
                }
                const orderInfo = await OrderInfo.find({ id_Size: idSize });
                console.log(orderInfo);
                if (orderInfo) {
                    for (let idOrderInfo of orderInfo) {
                        // Xóa id đơn đặt hàng chi tiết ra Phiếu  tổng
                        await Order.updateOne(
                            { _id: idOrderInfo.id_order },
                            { $pull: { id_orderInfo: idOrderInfo._id } },
                        );
                        // update tiền của từng phiếu nhập
                        const totalMoney = (await idOrderInfo.quantity) * idOrderInfo.export_price;
                        console.log(totalMoney);
                        await Order.updateOne({ _id: idOrderInfo.id_order }, { $inc: { totalPrice: -totalMoney } });
                    }
                }
                //OrderInfo
            }
            //Xóa id sản phẩm ra trạng thái
            const updateStatus = await Status.updateOne(
                { _id: product.status },
                { $pull: { id_product: product._id } },
            );

            //const destroyProduct = await Product.deleteOne({ _id: product._id });
            req.session.message = await {
                message: 'Xóa thành công !',
                type: 'success',
            };
            return res.redirect(`back`);
        } catch (err) {
            console.log(err);
        }
    }
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await Product.restore({ _id: reqId });
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
            const products = (await Array.isArray(req.body.products)) ? req.body.products : [req.body.products];
            const { id, roles } = await req.userStaff;
            switch (action) {
                case 'delete':
                    const resultOne = await Product.delete({ _id: { $in: products } });
                    if (resultOne) {
                        for (const idProduct of products) {
                            await Product.updateOneDeleted(
                                {
                                    _id: idProduct,
                                },
                                {
                                    deletedBy: id,
                                },
                            );
                        }
                        req.session.message = await {
                            message: 'Xóa thành công!',
                            type: 'success',
                        };
                        return res.redirect('back');
                    }
                    req.session.message = await {
                        message: 'Xóa thất bại!',
                        type: 'warning',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Product.restore({ _id: { $in: products } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'force':
                    if (roles === 'admin') {
                        const reqId = await req.params.slug;
                        const productsModel = await Product.findDeleted({ _id: { $in: products } });

                        for (let product of productsModel) {
                            const updateCategory = await Category.updateOne(
                                { _id: product.category },
                                { $pull: { id_product: product._id } },
                            );
                            //Xóa id ra document size
                            const checkSize = product.size ? product.size.length : 0;
                            if (checkSize > 0) {
                                for (const idSize of product.size) {
                                    await Cart.deleteMany({ product: idSize });
                                    await Size.deleteMany({ id_product: product._id });
                                    const receiptInfo = await ReceiptInfo.find({ id_Size: idSize });
                                    // xóa phiếu nhập hàng
                                    if (receiptInfo) {
                                        for (let idReceiptInfo of receiptInfo) {
                                            // Xóa id phiếu nhập chi tiết ra phiếu nhập tổng
                                            await Receipt.updateOne(
                                                { id_Receipt: idReceiptInfo.id_Receipt },
                                                { $pull: { id_ReceiptInfo: idReceiptInfo._id } },
                                            );
                                            // update tiền của từng phiếu nhập
                                            await Receipt.updateOne(
                                                { _id: idReceiptInfo.id_Receipt },
                                                { $inc: { total_money: -idReceiptInfo.total_money } },
                                            );
                                            // update totalPrice phiếu nhập
                                            await ReceiptInfo.deleteOne({ _id: idReceiptInfo._id });
                                        }
                                    }
                                }
                            }
                            // Xóa id sản phẩm ra trạng thái
                            if (product.status) {
                                const updateStatus = await Status.updateOne(
                                    { _id: product.status },
                                    { $pull: { id_product: product._id } },
                                );
                            }
                        }
                        const destroyProduct = await Product.deleteMany({ _id: { $in: products } });

                        req.session.message = await {
                            message: 'Xóa thành công !',
                            type: 'success',
                        };
                        return res.redirect(`back`);
                    } else {
                        req.session.message = await {
                            message: 'Không có quyền Admin !',
                            type: 'warning',
                        };
                        return res.redirect(`back`);
                    }

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
module.exports = new ProductController();
