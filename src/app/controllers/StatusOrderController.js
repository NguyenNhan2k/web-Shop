const StatusOrder = require('../model/StatusOrder');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
var getIndex = (payload, payloads, title) => {
    const indexProduct = payloads.map((payload) => payload.name).indexOf(payload.name);

    for (let i = 0; i < payloads.length; i++) {
        if (i == indexProduct) {
            continue;
        }
        if (payloads[i].name.trim() == title.trim()) {
            return false;
        }
    }
    return true;
};
class StatusControllerOrder {
    async showIndex(req, res, next) {
        const countStatusOrder = await StatusOrder.countDeleted({});
        const pagingStatusOrder = await StatusOrder.count({});
        const SIZE_PAGE = res.locals._page.pageSize;
        const countPaging = Math.ceil(pagingStatusOrder / SIZE_PAGE);
        const paging = [];
        for (let i = 0; i < countPaging; i++) {
            paging[i] = i + 1;
        }
        const statusOrder = await StatusOrder.find({}).paginal(req, res).sortable(req);
        try {
            return res.render('staff/showStatusOrder', {
                layout: 'staff',
                Status: mutipleMongooseToObject(statusOrder),
                countStatusOrder,
            });
        } catch (err) {}
    }
    async showDetail(req, res, next) {
        try {
            const reqStatus = await req.params.slug;
            const status = await StatusOrder.findOne({ _id: reqStatus });
            if (status) {
                return res.render('staff/showDetailStatusOrder', {
                    layout: 'staff',
                    status: mongooseToObject(status),
                });
            } else {
                return res.redirect('/statusProduct');
            }
        } catch (err) {
            return res.redirect('/statusProduct');
        }
    }
    async showCreate(req, res, next) {
        try {
            return res.render('staff/showCreateStatusOrder', {
                layout: 'staff',
            });
        } catch (err) {}
    }
    async showTrash(req, res, next) {
        try {
            const statusOrder = await StatusOrder.findDeleted({}).populate('deleteBy');
            return res.status(200).render('staff/showTrashStatusOrder', {
                layout: 'staff',
                statusOrder: mutipleMongooseToObject(statusOrder),
            });
        } catch (err) {}
    }
    async create(req, res, next) {
        try {
            const reqStatus = await req.body.name.trim();
            const status = await StatusOrder.findOne({ name: reqStatus });
            if (status) {
                req.session.message = {
                    message: 'Thất bại. Trùng tên trạng thái !',
                    type: 'warning',
                };
                return res.redirect('back');
            } else {
                const newStatus = new StatusOrder({ name: reqStatus });
                await newStatus.save();
                req.session.message = {
                    message: 'Thêm thành công!',
                    type: 'success',
                };
                return res.redirect('back');
            }
        } catch (err) {
            req.session.message = await {
                message: 'Thất bại!',
                type: 'warning',
            };
            await res.redirect('back');
        }
    }
    async update(req, res, next) {
        const { id, name } = await req.body;
        const idStatus = await StatusOrder.findById(id);
        const statusAll = await StatusOrder.find();
        try {
            if (idStatus) {
                const checkStatus = await getIndex(idStatus, statusAll, name);
                if (checkStatus) {
                    idStatus.name = name;
                    idStatus.save();
                    req.session.message = {
                        message: 'Update thành công!',
                        type: 'success',
                    };
                    return res.redirect(`back`);
                } else {
                    req.session.message = {
                        message: 'Trùng tên trạng thái',
                        type: 'warning',
                    };
                    return res.redirect(`back`);
                }
            } else {
                req.session.message = {
                    message: 'Update không thành công!',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            req.session.message = {
                message: 'Update không thành công!',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = req.params.slug;
            const { id, rolse } = req.userStaff;
            console.log(id);

            const result = await StatusOrder.delete({ _id: reqId });

            if (result) {
                const updateStatus = await StatusOrder.updateOneDeleted({ _id: reqId }, { $set: { deleteBy: id } });
                console.log(updateStatus);
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
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await StatusOrder.restore({ _id: reqId });
            if (result) {
                req.session.message = await {
                    message: 'Khôi phục thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            } else {
                req.session.message = await {
                    message: 'Khôi phục thất bại!',
                    type: 'warning',
                };
                return await res.redirect(`back`);
            }
        } catch (err) {
            req.session.message = await {
                message: 'Khôi phục thất bại!',
                type: 'warning',
            };
            return await res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = req.body.action;
            const statusOrder = req.body.statusOrders;
            console.log(statusOrder);
            switch (action) {
                case 'delete':
                    const resultOne = await StatusOrder.delete({ _id: { $in: statusOrder } });
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await StatusOrder.restore({ _id: { $in: statusOrder } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
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
        } catch (err) {}
    }
}
module.exports = new StatusControllerOrder();
