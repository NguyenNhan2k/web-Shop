const Products = require('../model/Products');
const Receipt = require('../model/Receipt');
const ReceiptInfo = require('../model/ReceiptInfo');
const Suppliers = require('../model/Supplier');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
const Size = require('../model/Size');
const isArray = (payload) => {
    if (payload) {
        return Array.isArray(payload) ? payload : [payload];
    }
    return payload;
};
class ReceiptController {
    async index(req, res, next) {
        try {
            const pagingReceipt = await Receipt.count({});
            const countReceipt = await Receipt.countDeleted({});
            const SIZE_PAGE = await res.locals._page.pageSize;
            const searchReceipt = await Receipt.find({});

            const receipts = await Receipt.find({}).search(req).sortable(req).paginal(req, res);
            const countPaging = Math.ceil(pagingReceipt / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            return res.render('staff/receipt', {
                layout: 'staff',
                paging,
                receipts: mutipleMongooseToObject(receipts),
                countReceipt,
                searchReceipt: mutipleMongooseToObject(searchReceipt),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async showTrash(req, res, next) {
        try {
            const receipt = await Receipt.findDeleted({}).populate('deleteBy');
            return res.status(200).render('staff/showTrashReceipt', {
                layout: 'staff',
                receipts: mutipleMongooseToObject(receipt),
            });
        } catch (err) {
            return res.redirect('back');
            console.log(err);
        }
    }
    async showDetail(req, res, next) {
        try {
            const idReceipt = await req.params.id;
            const receiptInfo = await ReceiptInfo.find({ id_Receipt: idReceipt }).populate([
                {
                    path: 'id_Size',
                    model: 'Size',
                    populate: {
                        path: 'id_product',
                        model: 'Product',
                        populate: {
                            path: 'size',
                            model: 'Size',
                        },
                    },
                },
                {
                    path: 'id_Supplier',
                    model: 'Supplier',
                },
            ]);
            const products = await Products.find({}).populate([
                {
                    path: 'size',
                },
                {
                    path: 'category',
                    model: 'Category',
                },
            ]);
            const supplier = await Suppliers.find({});
            const receipt = await Receipt.findOne({
                _id: idReceipt,
            }).populate('createBy');
            res.render('staff/showDetailReceipt', {
                layout: 'staff',
                receiptInfo: mutipleMongooseToObject(receiptInfo),
                products: mutipleMongooseToObject(products),
                supplier: mutipleMongooseToObject(supplier),
                receipt: mongooseToObject(receipt),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async showExport(req, res, next) {
        try {
            const products = await Products.find({})
                .paginal(req, res)
                .sortable(req, res)
                .populate([
                    {
                        path: 'size',
                    },
                    {
                        path: 'category',
                        model: 'Category',
                    },
                ]);
            const suppliers = await Suppliers.find({});
            const pagingProduct = await Products.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingProduct / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            const receipts = await Receipt.findOne({ _id: req.params.slug });
            return res.render('staff/showCreateReceipt-Info', {
                layout: 'staff',
                products: mutipleMongooseToObject(products),
                paging,
                receipts: mongooseToObject(receipts),
                suppliers: mutipleMongooseToObject(suppliers),
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async showCreate(req, res, next) {
        try {
            return res.render('staff/showCreateReceipt', {
                layout: 'staff',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async create(req, res, next) {
        try {
            const name = await req.body.name.trim();
            const { id, roles } = await req.userStaff;
            const checkReceipt = await Receipt.findOne({ name: name });
            if (checkReceipt) {
                req.session.message = await {
                    message: 'Trùng tên sản phẩm !',
                    type: 'warning',
                };
                return res.redirect('back');
            } else {
                const saveReceipt = await new Receipt({
                    name,
                    createBy: id,
                });
                await saveReceipt.save();
                req.session.message = await {
                    message: 'Thêm mã phiếu thành công !',
                    type: 'success',
                };
                return res.redirect('back');
            }
        } catch (error) {
            console.log(error);
            req.session.message = await {
                message: 'Thêm mã phiếu thất bại !',
                type: 'warning',
            };
            return res.redirect('back');
        }
    }
    async update(req, res) {
        try {
        } catch (e) {
            console.log(e);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = req.params.slug;
            const { id, rolse } = req.userStaff;
            const result = await Receipt.delete({ _id: reqId });
            if (result) {
                await Receipt.updateOneDeleted({ _id: reqId }, { deleteBy: id });
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
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const { id, roles } = await req.userStaff;
            const action = await req.body.action;
            const receipt = await req.body.receipt;
            const receipts = await isArray(req.body.receipts);
            const receiptId = await isArray(req.body.id_receiptInfo);
            const sizes = await isArray(req.body.size);
            const quantity = await isArray(req.body.quantity);
            const exportPrice = await isArray(req.body.export_price);
            const supplierReq = await isArray(req.body.supplier);

            // Láy giá trị khi xóa sản phảm
            const receiptIdDelete = await isArray(req.body.receiptDelete);
            const sizeDelete = await isArray(req.body.sizeDelete);
            const quantityDelete = await isArray(req.body.quantityDelete);
            const totalPriceDelete = await isArray(req.body.totalPriceDelete);
            switch (action) {
                case 'update':
                    const receiptModel = await Receipt.findOne({ _id: receipt }).populate('id_ReceiptInfo');
                    const checkDeleteProduct =
                        (await sizeDelete) && quantityDelete && totalPriceDelete && receiptIdDelete;
                    if (checkDeleteProduct) {
                        for (let i = 0; i < receiptIdDelete.length; i++) {
                            // Xóa id receipt chi tiet trong mảng tổng
                            await Receipt.updateOne(
                                { _id: receipt },
                                { $pull: { id_ReceiptInfo: receiptIdDelete[i] } },
                            );
                            await Size.updateOne({ _id: sizeDelete[i] }, { $inc: { count: -quantityDelete[i] } });
                            await Receipt.updateOne({ _id: receipt }, { $inc: { total_money: -totalPriceDelete[i] } });
                            await ReceiptInfo.deleteOne({ _id: receiptIdDelete[i] });
                            await Suppliers.updateOne(
                                { id_receiptInf: { $in: receiptIdDelete[i] } },
                                { $pull: { id_receiptInf: receiptIdDelete[i] } },
                            );
                        }
                    }
                    // Update sản phẩm trong phiếu nhập
                    let totalMoneyReceipt = 0;
                    for (let i = 0; i < receiptId.length; i++) {
                        const receiptInfoModel = await ReceiptInfo.findOne({ _id: receiptId[i] });
                        // Xóa số lượng củ của size sản phẩm
                        await Size.updateOne(
                            { _id: receiptInfoModel.id_Size },
                            { $inc: { count: -receiptInfoModel.count } },
                        );
                        await Suppliers.updateOne(
                            { _id: receiptInfoModel.id_Supplier },
                            { $pull: { id_receiptInfo: receiptInfoModel._id } },
                        );
                        // Update mới lại
                        const totalMoneyNew = (await parseInt(quantity[i])) * parseInt(exportPrice[i]);
                        receiptInfoModel.export_price = await exportPrice[i];
                        receiptInfoModel.count = await quantity[i];
                        receiptInfoModel.id_Supplier = await supplierReq[i];
                        receiptInfoModel.total_money = await totalMoneyNew;
                        receiptInfoModel.id_Size = await sizes[i];
                        await receiptInfoModel.save();
                        totalMoneyReceipt += await receiptInfoModel.total_money;
                        // Update số lượng sản phẩm theo size
                        await Size.updateOne(
                            { _id: receiptInfoModel.id_Size },
                            { $inc: { count: receiptInfoModel.count } },
                        );
                        await Suppliers.updateOne(
                            { _id: receiptInfoModel.id_Supplier },
                            { $push: { id_receiptInfo: receiptInfoModel._id } },
                        );
                    }
                    receiptModel.total_money = await totalMoneyReceipt;
                    await receiptModel.save();
                    req.session.message = await {
                        message: 'Update thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'destroy':
                    const resultOne = await Receipt.delete({ _id: { $in: receipts } });
                    for (let receiptId of receipts) {
                        await Receipt.updateOneDeleted({ _id: receiptId }, { deleteBy: id });
                    }
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Receipt.restore({ _id: { $in: receipts } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'force':
                    const receiptForce = await Receipt.findDeleted({ _id: { $in: receipts } }).populate(
                        'id_ReceiptInfo',
                    );
                    if (receiptForce) {
                        for (let receipt of receiptForce) {
                            for (let receiptInfo of receipt.id_ReceiptInfo) {
                                await Size.updateOne(
                                    { _id: receiptInfo.id_Size },
                                    { $inc: { count: -receiptInfo.count } },
                                );
                                await Suppliers.updateOne(
                                    { _id: receiptInfo.id_Supplier },
                                    { $pull: { id_receiptInfo: receiptInfo._id } },
                                );
                            }
                            const receiptInfo = await ReceiptInfo.deleteMany({
                                _id: { $in: receipt.id_ReceiptInfo },
                            });
                            await Receipt.deleteOne({ _id: receipt._id });
                        }
                        req.session.message = await {
                            message: 'Xóa thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    req.session.message = await {
                        message: 'Xóa thất bại !',
                        type: 'war',
                    };
                    return await res.redirect(`back`);
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
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await Receipt.restore({ _id: reqId });
            if (result && reqId) {
                req.session.message = await {
                    message: 'Khôi phục thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Khôi phục thât bại !',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
        } catch (err) {
            req.session.message = await {
                message: 'Khôi phục thât bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
    async forceDestroy(req, res, next) {
        try {
            const reqId = await req.params.slug;
            if (reqId) {
                // Query phiếu nhập
                const receiptInfos = await ReceiptInfo.find({ id_Receipt: reqId });
                for (let receiptInfo of receiptInfos) {
                    await Size.updateOne({ _id: receiptInfo.id_Size }, { $inc: { count: -receiptInfo.count } });
                    await ReceiptInfo.deleteOne({ _id: receiptInfo._id });
                    await Suppliers.updateOne(
                        { _id: receiptInfo.id_Supplier },
                        { $pull: { id_receiptInfo: receiptInfo._id } },
                    );
                }
                await Receipt.deleteOne({ _id: reqId });
                req.session.message = await {
                    message: 'Xóa thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
}
module.exports = new ReceiptController();
