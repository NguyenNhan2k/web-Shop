const Size = require('../model/Size');
const Invoice = require('../model/Invoice');
const User = require('../model/User');
const Cart = require('../model/Cart');
const Products = require('../model/Products');
const Order = require('../model/Order');
const StatusOrder = require('../model/StatusOrder');
const OrderInfo = require('../model/OrderInfo');

const { ObjectId } = require('mongodb');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

class OrderController {
    async index(req, res) {
        try {
            const orders = await Order.find({}).populate('status');
            const countOrder = await Order.countDeleted({});
            const productsModel = await Products.find({}).populate('size');
            const searchOrder = await Order.find({});
            const pagingOrder = await Order.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingOrder / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            return res.render('staff/order', {
                layout: 'staff',
                orders: mutipleMongooseToObject(orders),
                searchOrder: mutipleMongooseToObject(searchOrder),
                products: mutipleMongooseToObject(productsModel),
                countOrder,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async showTrash(req, res, next) {
        try {
            const orders = await Order.findDeleted({}).populate([
                {
                    path: 'id_user',
                    model: 'Customer',
                },
                {
                    path: 'deleteBy',
                    model: 'User',
                },
            ]);
            return res.status(200).render('staff/showTrashOrder', {
                layout: 'staff',
                orders: mutipleMongooseToObject(orders),
            });
        } catch (err) {
            console.log(err);
        }
    }
    async showDetail(req, res, next) {
        try {
            const slug = await req.params.slug;
            const products = await Products.find({}).populate([
                {
                    path: 'size',
                },
                {
                    path: 'category',
                    model: 'Category',
                },
            ]);
            const statusModel = await StatusOrder.find({});
            const pagingProduct = await Products.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingProduct / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            const statusOrder = await StatusOrder.find({});
            if (slug) {
                const order = await Order.findOne({ _id: slug }).populate([
                    {
                        path: 'id_orderInfo',
                        model: 'OrderInfo',
                        populate: {
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
                    },
                    {
                        path: 'id_user',
                        model: 'User',
                    },
                    {
                        path: 'status',
                        model: 'StatusOrder',
                    },
                ]);
                return res.status(200).render('staff/showDetailOrder', {
                    layout: 'staff',
                    order: mongooseToObject(order),
                    paging,
                    products: mutipleMongooseToObject(products),
                    status: mutipleMongooseToObject(statusModel),
                    statusOrder: mutipleMongooseToObject(statusOrder),
                });
            } else {
                return res.redirect('back');
            }
        } catch (err) {}
    }
    async add(req, res) {
        try {
            // chuyển thành array để for qua
            var order;
            if (Array.isArray(req.body.cart)) {
                order = req.body;
            } else {
                order = req.body;
                order.cart = [order.cart];
                order.quantity = [order.quantity];
                order.export_price = [order.export_price];
            }
            // Lưu document dơn hàng
            const orderNew = await new Order({
                name: order.name,
                phone: order.phone,
                email: order.email,
                address: order.address,
                id_user: req.user.id,
                totalPrice: order.totalPrice,
            });
            await orderNew.save();
            // tạo đơn hàng chi tiết gồm sản phẩm và số lượng
            for (let i = 0; i < order.quantity.length; i++) {
                const orderInfo = await new OrderInfo({
                    id_Size: order.cart[i],
                    quantity: order.quantity[i],
                    export_price: order.export_price[i],
                    id_order: orderNew._id,
                });
                await orderInfo.save();
                // lưu id của đơn hàng chi tiết vào đơn hàng
                await Order.updateOne({ _id: orderNew._id }, { $push: { id_orderInfo: orderInfo._id } });
            }
            // Xóa giỏ hàng
            await Cart.deleteMany({ _id: { $in: order.id_cart } });
            req.session.message = await {
                message: 'Đặt hàng thành công !',
                type: 'success',
            };
            return res.redirect(`/cart`);
        } catch (err) {
            req.session.message = await {
                message: 'Đặt hàng thất bại !',
                type: 'warning',
            };
            return res.redirect(`/cart`);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = await req.params.slug;
            const orderModel = await Order.findOne({ _id: reqId });
            const { id, roles } = await req.userStaff;

            if (orderModel) {
                orderModel.deleteBy = await id;
                await orderModel.save();

                await Order.delete({ _id: orderModel._id });

                req.session.message = await {
                    message: 'Xóa đơn hàng thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Xóa đơn hàng thất bại !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            req.session.message = await {
                message: 'Xóa đơn hàng thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = await req.body.action;
            const orders = await req.body.orders;
            const { id, roles } = await req.userStaff;
            switch (action) {
                case 'delete':
                    const orderDelete = await Order.find({ _id: { $in: orders } });
                    if (orderDelete) {
                        for (let order of orderDelete) {
                            order.deleteBy = await id;
                            await order.save();
                            await Order.delete({ _id: order._id });
                        }
                        req.session.message = await {
                            message: 'Xóa đơn hàng thành công!',
                            type: 'success',
                        };
                        return res.redirect('back');
                    }
                    req.session.message = await {
                        message: 'Xóa đơn hàng thất bại!',
                        type: 'waning',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Order.restore({ _id: { $in: orders } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    } else {
                        req.session.message = await {
                            message: 'Khôi phục thất bại !',
                            type: 'warning',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'force':
                    const orderModel = await Order.findDeleted({ _id: { $in: orders } });
                    if (orderModel) {
                        for (let order of orderModel) {
                            const checkExportOrder = (await order.status) === null;
                            console.log(checkExportOrder);
                            let orderInfoModel = await OrderInfo.find({ _id: { $in: order.id_orderInfo } });
                            if (checkExportOrder) {
                                for (let orderInfo of orderInfoModel) {
                                    console.log(orderInfo);
                                    await orderInfo.deleteOne({ _id: orderInfo._id });
                                }
                                await Order.deleteOne({ _id: order._id });
                                continue;
                            }
                            // Cộng lại số lượng trong kho
                            for (let orderInfo of orderInfoModel) {
                                await Size.updateOne(
                                    { _id: orderInfo.id_Size },
                                    { $inc: { count: orderInfo.quantity } },
                                );
                            }
                            await Order.deleteOne({ _id: order._id });
                        }
                        req.session.message = await {
                            message: 'Xóa đơn hàng thành công !',
                            type: 'success',
                        };
                        return res.redirect(`back`);
                    }
                    req.session.message = await {
                        message: 'Xóa đơn hàng thất bại !',
                        type: 'warning',
                    };
                    return res.redirect(`back`);
                default:
                    req.session.message = await {
                        message: 'Thực hiện Action thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
            }
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect('back');
        }
    }
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await Order.restore({ _id: reqId });
            if (result) {
                req.session.message = await {
                    message: 'Khôi phục thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Khôi phục thất bại !',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
        } catch (err) {
            req.session.message = await {
                message: 'Khôi phục thất bại !',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
    async forceDestroy(req, res, next) {
        try {
            const idOrder = await req.params.slug;
            const orderModel = await Order.findOneDeleted({ _id: idOrder });
            //Kiểm tra đơn hàng đã xác nhận chưa
            const checkExportOrder = (await orderModel.status) === null;
            let orderInfoModel = await OrderInfo.find({ _id: { $in: orderModel.id_orderInfo } });
            if (orderModel) {
                if (checkExportOrder) {
                    for (let orderInfo of orderInfoModel) {
                        await orderInfo.deleteOne({ _id: orderInfo._id });
                    }
                    await Order.deleteOne({ _id: idOrder });
                    req.session.message = await {
                        message: 'Xóa đơn hàng thành công !',
                        type: 'success',
                    };
                    return await res.redirect(`back`);
                }
                // Cộng lại số lượng trong kho
                for (let orderInfo of orderInfoModel) {
                    await Size.updateOne({ _id: orderInfo.id_Size }, { $inc: { count: orderInfo.quantity } });
                }
                await Order.deleteOne({ _id: idOrder });
                req.session.message = await {
                    message: 'Xóa đơn hàng thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Xóa đơn hàng thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xóa đơn hàng thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async handleDetailOrder(req, res, next) {
        const { id } = await req.userStaff;
        try {
            const [action, idAction] = (await req.body.actions) ? req.body.actions.split('|') : req.body.actions;
            const order = await req.body.order;
            const quantity = Array.isArray(req.body.quantity) ? req.body.quantity : [req.body.quantity];
            const sizeOrderInfo = Array.isArray(req.body.size) ? req.body.size : [req.body.size];

            const sizeAdd = Array.isArray(req.body.sizeAdd) ? req.body.sizeAdd : [req.body.sizeAdd];
            const quantityAdd = Array.isArray(req.body.quantityAdd) ? req.body.quantityAdd : [req.body.quantityAdd];
            const productAdd = Array.isArray(req.body.product) ? req.body.product : [req.body.product];

            const idOrderInfoDelete = Array.isArray(req.body.id_orderInfoDelete)
                ? req.body.id_orderInfoDelete
                : [req.body.id_orderInfoDelete];
            const idOrderInfo = Array.isArray(req.body.id_orderInfo) ? req.body.id_orderInfo : [req.body.id_orderInfo];
            var { name, email, phone, address } = await req.body;
            // I. kiểm tra đơn hàng đang giao
            const sizeModelUpdate = await Size.find({ _id: { $in: sizeOrderInfo } });

            switch (action) {
                case 'update':
                    const orderModel = await Order.findOne({ _id: order }).populate('status');
                    const orderInfoUpdate = await OrderInfo.find({ _id: { $in: orderModel.id_orderInfo } });
                    const checkStatusUpdate =
                        (await orderModel.status) == null || orderModel.status.name == 'Xác nhận đơn';
                    const dateReq = await req.body.dateShip;
                    // 1. Kiểm tra số lượng trong kho và số lượng hàng lớn hon0
                    for (let i = 0; i < sizeModelUpdate.length; i++) {}
                    //2. Kiểm tra trạng thái đơn hàng (Xác nhận đơn -- null)
                    if (!checkStatusUpdate) {
                        req.session.message = await {
                            message: 'Đơn hàng đã được xác nhân !',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    console.log(idOrderInfoDelete);
                    // 4. Nều không có lỗi
                    if (orderModel) {
                        // Xóa đơn hàng chi tiết trong đơn hàng
                        if (idOrderInfoDelete[0] !== undefined) {
                            for (let i = 0; i < idOrderInfoDelete.length; i++) {
                                let orderInfo = await OrderInfo.findOne({ _id: idOrderInfoDelete[i] });
                                // Cộng số lượng size sản phẩm
                                await Size.updateOne(
                                    { _id: orderInfo.id_Size },
                                    { $inc: { count: orderInfo.quantity } },
                                );
                                // Xóa id info ra Order tổng
                                await Order.updateOne(
                                    { _id: order },
                                    { $pull: { id_orderInfo: idOrderInfoDelete[i] } },
                                );
                                const totalDelete = (await orderInfo.quantity) * orderInfo.export_price;
                                console.log(totalDelete);
                                await Order.updateOne({ _id: order }, { $inc: { totalPrice: -totalDelete } });
                                await OrderInfo.findOneAndDelete({ _id: idOrderInfoDelete[i] });
                            }
                        }
                        const orderInfoModel = await OrderInfo.find({ _id: { $in: idOrderInfo } });
                        Object.assign(orderModel, {
                            email,
                            name,
                            phone,
                            address,
                        });
                        // update số lượng và size sản phẩm vào đơn hàng chi tiết
                        var totalPrice = await 0; // Tổng giá đơn hàng
                        for (let i = 0; i < orderInfoModel.length; i++) {
                            orderInfoModel[i].quantity = await quantity[i];
                            orderInfoModel[i].id_Size = await sizeOrderInfo[i];
                            totalPrice += orderInfoModel[i].quantity * orderInfoModel[i].export_price;
                            orderInfoModel[i].save();
                        }
                        orderModel.totalPrice = await totalPrice;
                        await orderModel.save();
                        // a. có sự thay đổi sản phẩm trong đơn hàng

                        const checkAdd = sizeAdd[0] && productAdd[0] && quantityAdd[0];
                        if (checkAdd) {
                            const countAddOrderInfo = sizeAdd.length && productAdd.length;

                            for (let i = 0; i < countAddOrderInfo; i++) {
                                const productAdd = await Size.findOne({ _id: sizeAdd[i] }).populate('id_product');
                                const exportPrice = await productAdd.id_product.export_price;
                                // Kiểm tra số lượng nhập lớn hơn số lượng trong kho --> bỏ qua
                                const checkCount = (await parseInt(quantityAdd[i])) > productAdd.count;
                                if (checkCount) {
                                    continue;
                                }
                                // Đặt cờ nếu có trùng
                                let flag = await false;
                                // Kiểm tra sản phẩm có sẵn trong của hàng -- nếu có thì cộng dồn vào đơn hàng
                                for (let orderInfo of orderInfoUpdate) {
                                    //Nếu trùng --> update số lượng của kho va phiếu đặt hàng
                                    if (orderInfo.id_Size.equals(productAdd._id)) {
                                        orderInfo.quantity += await parseInt(quantityAdd[i]);
                                        productAdd.count -= await parseInt(quantityAdd[i]);
                                        await orderInfo.save();
                                        await productAdd.save();
                                        orderModel.totalPrice +=
                                            (await orderInfo.export_price) * parseInt(quantityAdd[i]);
                                        await orderModel.save();
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    continue;
                                }
                                const newOrderInfo = await new OrderInfo({
                                    id_Size: productAdd._id,
                                    quantity: quantityAdd[i],
                                    export_price: exportPrice,
                                    id_order: order,
                                });
                                await newOrderInfo.save();
                                // thêm id orderinfo vào order tổng
                                await Order.updateOne(
                                    { _id: orderModel._id },
                                    { $push: { id_orderInfo: newOrderInfo._id } },
                                );
                                await Size.updateOne(
                                    { _id: newOrderInfo.id_Size },
                                    { $inc: { count: -newOrderInfo.quantity } },
                                );
                                // Cộng vào tổng đơn hàng
                                const totalPriceUpdate = newOrderInfo.quantity * newOrderInfo.export_price;
                                await Order.updateOne(
                                    { _id: orderModel._id },
                                    { $inc: { totalPrice: totalPriceUpdate } },
                                );
                            }
                        }

                        req.session.message = await {
                            message: 'Update đơn hàng thành công !',
                            type: 'success',
                        };
                        return res.redirect('back');
                    }
                    req.session.message = await {
                        message: 'Update thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
                // Xác nhận đơn hàng
                case 'Xác nhận đơn':
                    const orderModelConfirm = await Order.findOne({ _id: order });
                    const checkStatusOrder = (await orderModelConfirm.status)
                        ? orderModelConfirm.status.equals(ObjectId(idAction))
                        : false;
                    var checkQuantityConfirm = false;
                    // 1. Kiểm tra số lượng trong kho và số lượng hàng lớn hon0
                    sizeModelUpdate.forEach((size, index) => {
                        if (quantity[index] > size.count || quantity[index] < 0) {
                            checkQuantityConfirm = true;
                        }
                    });
                    if (checkQuantityConfirm) {
                        req.session.message = await {
                            message: 'Số lượng sản phẩm không đủ !',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    if (checkStatusOrder) {
                        req.session.message = await {
                            message: 'Đơn hàng đã được xác nhận!',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    if (orderModelConfirm) {
                        //2. Lưu id trạng thái vào đơn hàng
                        orderModelConfirm.confirmBy = await id;
                        orderModelConfirm.status = await idAction;
                        await orderModelConfirm.save();

                        // 3. Trừ số lượng hàng trong kho
                        const orderInfoModel = await OrderInfo.find({ _id: { $in: idOrderInfo } });
                        for (let i = 0; i < sizeOrderInfo.length; i++) {
                            const count = await orderInfoModel[i].quantity;
                            const sizeModelConfirm = await Size.updateOne(
                                { _id: sizeOrderInfo[i] },
                                { $inc: { count: -count } },
                            );
                        }
                        // 4. render ra giao diện
                        req.session.message = await {
                            message: 'Xác nhận thành công !',
                            type: 'success',
                        };
                        return res.redirect('back');
                    }
                    //1. lấy id trạng thái xác nhận đơn
                    req.session.message = await {
                        message: 'Đơn hàng đã xác nhận !',
                        type: 'warning',
                    };
                    return res.redirect('back');
                // Xuất đơn hàng --- tạo hóa đơn
                case 'Xuất kho':
                    const orderModelExport = await Order.findOne({ _id: order });
                    // Kiểm tra ngày đặt - ngày giao
                    const dateOrder = await orderModelExport.createdAt;
                    const dateShip = new Date(req.body.dateShip);
                    const checkDate = (await dateShip) > dateOrder;
                    // Kiểm tra trạng thái đã xuất kho chưa
                    const checkStatus = await orderModelExport.status.equals(ObjectId(idAction));
                    if (!checkDate) {
                        req.session.message = await {
                            message: 'Ngày GH lớn hơn ngày đặt!',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    if (checkStatus) {
                        req.session.message = await {
                            message: 'Đơn hàng đã xuất kho!',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    if (checkDate && !checkStatus) {
                        orderModelExport.date_ship = await dateShip;
                        orderModelExport.status = await idAction;
                        await orderModelExport.save();
                        req.session.message = await {
                            message: 'Xuất kho thành công !',
                            type: 'success',
                        };
                        return res.redirect('back');
                    }

                    req.session.message = await {
                        message: 'Hành động xuất kho lỗi!',
                        type: 'warning',
                    };
                    return res.redirect('back');
                    break;
                case 'Hoàn đơn':
                    const orderRefund = await Order.findOne({ _id: order });
                    const checkStatusRefund = await orderRefund.status.equals(ObjectId(idAction));
                    if (checkStatusRefund) {
                        req.session.message = await {
                            message: 'Đơn hàng đã bị hoàn!',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    orderRefund.status = await idAction;
                    await orderRefund.save();

                    const orderInfoModel = await OrderInfo.find({ _id: { $in: idOrderInfo } });
                    for (let orderInfo of orderInfoModel) {
                        await Size.updateOne({ _id: orderInfo.id_Size }, { $inc: { count: orderInfo.quantity } });
                    }

                    req.session.message = await {
                        message: 'Hoàn đơn thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'Đã thanh toán':
                    const orderPay = await Order.findOne({ _id: order });
                    const checkStatusPay = await orderPay.status.equals(ObjectId(idAction));
                    if (checkStatusPay) {
                        req.session.message = await {
                            message: 'Đơn hàng đã được thanh toán!',
                            type: 'warning',
                        };
                        return res.redirect('back');
                    }
                    orderPay.status = await idAction;
                    await orderPay.save();
                    req.session.message = await {
                        message: 'Đơn hàng thanh toán thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');

                default:
                    req.session.message = await {
                        message: 'Thực hiện Actions thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
            }
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Thất bại !',
                type: 'warning',
            };
            return res.redirect('back');
        }
    }
}
module.exports = new OrderController();
