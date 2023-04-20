const Products = require('../model/Products');
const Status = require('../model/StatusProduct');
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
class StatusController {
    async showIndex(req, res, next) {
        const statusAll = await Status.find({});
        try {
            console.log('o day');
            return res.render('staff/showStatus', {
                layout: 'staff',
                Status: mutipleMongooseToObject(statusAll),
            });
        } catch (err) {}
    }
    async showDetail(req, res, next) {
        try {
            const reqStatus = await req.params.slug;
            const status = await Status.findOne({ _id: reqStatus });
            if (status) {
                return res.render('staff/showDetailStatus', {
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
            return res.render('staff/showCreateStatus', {
                layout: 'staff',
            });
        } catch (err) {}
    }
    async create(req, res, next) {
        try {
            const reqStatus = await req.body.name.trim();
            const { id, roles } = await req.userStaff;
            const status = await Status.findOne({ name: reqStatus });
            console.log(status);
            if (status) {
                req.session.message = {
                    message: 'Thất bại. Trùng tên trạng thái !',
                    type: 'warning',
                };
                return res.redirect('/statusProduct/create');
            } else {
                const newStatus = new Status({ name: reqStatus, createBy: id });
                await newStatus.save();
                req.session.message = {
                    message: 'Thêm trạng thái thành công!',
                    type: 'success',
                };
                return res.redirect('/statusProduct/create');
            }
        } catch (err) {
            req.session.message = await {
                message: 'Thất bại!',
                type: 'warning',
            };
            await res.redirect('/statusProduct/create');
        }
    }
    async update(req, res, next) {
        const { id, name } = await req.body;
        const idStatus = await Status.findById(id);
        const statusAll = await Status.find();
        try {
            if (idStatus) {
                const checkStatus = await getIndex(idStatus, statusAll, name);
                if (checkStatus) {
                    idStatus.name = name;
                    idStatus.save();
                    req.session.message = {
                        message: 'Update trạng thái thành công!',
                        type: 'success',
                    };
                    return res.redirect(`/statusProduct/${idStatus._id}`);
                } else {
                    req.session.message = {
                        message: 'Trùng tên trạng thái',
                        type: 'warning',
                    };
                    return res.redirect(`/statusProduct/${idStatus._id}`);
                }
            } else {
                req.session.message = {
                    message: 'Update không thành công!',
                    type: 'warning',
                };
                return res.redirect(`/statusProduct/${idStatus._id}`);
            }
        } catch (err) {
            req.session.message = {
                message: 'Update không thành công!',
                type: 'warning',
            };
            return res.redirect(`/statusProduct/${idStatus._id}`);
        }
    }
}
module.exports = new StatusController();
