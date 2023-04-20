const Products = require('../model/Products');
const Size = require('../model/Size');
const Receipt = require('../model/Receipt');
const ReceiptInfo = require('../model/ReceiptInfo');
const Suppliers = require('../model/Supplier');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

class ReceiptInfoController {
    async index(req, res, next) {
        try {
            const pagingReceipt = await Receipt.count({});
            const SIZE_PAGE = await res.locals._page.pageSize;
            const receipts = await Receipt.find({}).sortable(req);
            const countPaging = Math.ceil(pagingReceipt / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            return res.render('staff/receipt', {
                layout: 'staff',
                paging,
                receipts: mutipleMongooseToObject(receipts),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async showCreate(req, res, next) {
        try {
            const products = await Products.find({}).paginal(req, res).sortable(req, res).populate({
                path: 'size',
            });
            const suppliers = await Suppliers.find({});
            const pagingProduct = await Products.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingProduct / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            return res.render('staff/showCreateReceipt-Info', {
                layout: 'staff',
                products: mutipleMongooseToObject(products),
                paging,
                suppliers: mutipleMongooseToObject(suppliers),
                paging,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async create(req, res, next) {
        try {
            const valueProduct = (await Array.isArray(req.body.name))
                ? req.body
                : {
                      receipt: req.body.receipt,
                      size: [req.body.size],
                      supplier: [req.body.supplier],
                      count: [req.body.count],
                      export_price: [req.body.export_price],
                  };

            if (valueProduct) {
                const countReceipt = valueProduct.size.length;
                for (let i = 0; i < countReceipt; i++) {
                    const total_money =
                        (await parseInt(valueProduct.count[i])) * parseInt(valueProduct.export_price[i]);
                    const receiptInfo = await new ReceiptInfo({
                        id_Size: valueProduct.size[i],
                        id_Receipt: valueProduct.receipt,
                        id_Supplier: valueProduct.supplier[i],
                        count: valueProduct.count[i],
                        export_price: valueProduct.export_price[i],
                        total_money,
                    });
                    await receiptInfo.save();
                    console.log(valueProduct.supplier[i], receiptInfo._id);
                    await Receipt.updateOne(
                        { _id: receiptInfo.id_Receipt },
                        { $push: { id_ReceiptInfo: receiptInfo._id } },
                    );
                    await Suppliers.updateOne(
                        { _id: valueProduct.supplier[i] },
                        { $push: { id_receiptInfo: receiptInfo._id } },
                    );
                    await Receipt.updateOne(
                        { _id: receiptInfo.id_Receipt },
                        { $inc: { total_money: receiptInfo.total_money } },
                    );
                    const sizeProduct = await Size.updateOne(
                        {
                            _id: receiptInfo.id_Size,
                        },
                        { $inc: { count: receiptInfo.count } },
                    );
                }
                req.session.message = await {
                    message: 'Nhập hàng thành công !',
                    type: 'success',
                };
                return res.redirect('back');
            } else {
                req.session.message = await {
                    message: 'Nhập hàng thất bại !',
                    type: 'warning',
                };
                return res.redirect('back');
            }
        } catch (error) {
            console.log(error);
            req.session.message = await {
                message: 'Nhập hàng thất bại !',
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
}
module.exports = new ReceiptInfoController();
