const User = require('../model/User');
const Receipt = require('../model/Receipt');
const Size = require('../model/Size');
const Category = require('../model/Category');
const Customer = require('../model/Customer');
const Order = require('../model/Order');
const StatusOrder = require('../model/StatusOrder');
const StatusProduct = require('../model/StatusProduct');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
const { isArray } = require('../middleware/handleMiddleWare.js');

class StaffController {
    async index(req, res, next) {
        try {
            const staff = await User.find({}).paginal(req, res).sortable(req).search(req);
            const countStaff = await User.countDeleted();
            const search = await User.find({});
            const pagingStaff = await User.count();
            const SIZE_PAGE = await res.locals._page.pageSize;
            const countPaging = await Math.ceil(pagingStaff / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = (await i) + 1;
            }
            return res.render('staff/staff', {
                layout: 'staff',
                staff: mutipleMongooseToObject(staff),
                search: mutipleMongooseToObject(search),
                countStaff,
                paging,
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xem chi tiết thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async info(req, res, next) {
        try {
            const { id, roles } = await req.userStaff;
            const user = await User.findOne({ _id: id }).then((result) => result);
            return res.render('staff/showInfoStaff', {
                layout: 'staff',
                user: mongooseToObject(user),
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Xem chi tiết thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async logout(req, res, next) {
        try {
            await res.clearCookie('assesTokenStaff', { path: '/' });
            return res.render('shop/login', {
                layout: 'main',
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Đăng xuất thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async update(req, res, next) {
        try {
            const { name, phone, address, email, id, img } = await req.body;
            const isEmpty = (await name) && phone && address && email && id ? true : false;
            const uploadFile = (await req.file) && req.file.originalname ? req.file.originalname : img;
            const newUser = await User.findOne({ _id: id });
            console.log(req.body);
            if (!isEmpty) {
                req.session.message = await {
                    message: 'Vui lòng nhập trường bị trống !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
            if (newUser) {
                newUser.name = await name;
                newUser.phone = await phone;
                newUser.email = await email;
                newUser.address = await address;
                newUser.images = await uploadFile;
                newUser.save();
                req.userStaff = await newUser;
                req.session.message = await {
                    message: 'Update thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Update thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Update thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async showCreate(req, res, next) {
        try {
            return res.render('staff/showCreateStaff', {
                layout: 'staff',
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Thêm nhân viên thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async showDetail(req, res, next) {
        try {
            const reqCustomerId = await req.params.id;
            const staff = reqCustomerId && (await User.findOne({ _id: reqCustomerId }));
            if (staff) {
                return res.render('staff/showDetailStaff', {
                    layout: 'staff',
                    staff: mongooseToObject(staff),
                });
            }
            req.session.message = await {
                message: 'Xem chi tiết bị lỗi!',
                type: 'warning',
            };
            return res.redirect(`back`);
        } catch (next) {
            console.log(next);
            req.session.message = await {
                message: 'Xem chi tiết bị lỗi!',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async create(req, res, next) {
        try {
            const uploadFile = (await req.file) && req.file.originalname;
            const { name, phone, address, email, password, confirm } = await req.body;
            const isEmpty = (await name) && phone && address && email && password && confirm ? true : false;
            const isPassword = (await password) === confirm;
            const isEmail = await User.findOne({ email: email });
            if (!isEmpty) {
                req.session.message = await {
                    message: 'Vui lòng nhập trường bị trống !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
            if (isEmail) {
                req.session.message = await {
                    message: 'Tên tài khoản đã tồn tại !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
            if (!isPassword) {
                req.session.message = await {
                    message: 'Mật khẩu không trùng khớp!',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
            const salt = await bcrypt.genSalt(10);
            const staffModel = await new User({
                name,
                phone,
                email,
                address,
                password: password,
                images: uploadFile,
            });
            staffModel.password = await bcrypt.hash(password, salt);
            await staffModel.save();
            req.session.message = await {
                message: 'Thêm tài khoản thành công!',
                type: 'success',
            };
            return res.redirect(`back`);
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Thêm nhân viên thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async destroy(req, res) {
        try {
            const reqId = req.params.id;
            const result = await User.delete({ _id: reqId });
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
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async forceDestroy(req, res) {
        try {
            const reqId = await req.params.id;
            if (!reqId) {
                req.session.message = await {
                    message: 'Xóa thất bại !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            }
            //Xóa id trong danh mục
            await Category.updateMany({ deleteBy: reqId }, { $set: { deleteBy: null } });
            await Receipt.updateMany({ createBy: reqId }, { $set: { createBy: null } });
            await Customer.updateMany({ deletedBy: reqId }, { $set: { deletedBy: null } });
            await Size.updateMany({ deletedBy: reqId }, { $set: { deletedBy: null } });
            await Order.updateMany({ deleteBy: reqId }, { $set: { deleteBy: null } });
            await StatusOrder.updateMany({ deleteBy: reqId }, { $set: { deleteBy: null } });
            await StatusProduct.updateMany({ deleteBy: reqId }, { $set: { deleteBy: null } });
            const result = await User.deleteOne({ _id: reqId });
            req.session.message = await {
                message: 'Xóa thành công !',
                type: 'success',
            };
            return res.redirect(`back`);
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
            const reqId = await req.params.id;
            const UserModel = await User.restore({ _id: reqId });
            if (UserModel) {
                req.session.message = await {
                    message: 'Khôi phục thành công !',
                    type: 'success',
                };
                return await res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Khôi phục thất bại !',
                type: 'wanning',
            };
            return await res.redirect(`back`);
        } catch (err) {
            req.session.message = await {
                message: 'Khôi phục thất bại !',
                type: 'wanning',
            };
            return await res.redirect(`back`);
        }
    }
    async showTrash(req, res, next) {
        try {
            const staff = await User.findDeleted().paginal(req, res).sortable(req);
            const countStaff = await User.countDeleted();
            const pagingStaff = await User.count();
            const SIZE_PAGE = await res.locals._page.pageSize;
            const countPaging = await Math.ceil(pagingStaff / SIZE_PAGE);
            const paging = await [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = (await i) + 1;
            }
            return res.status(200).render('staff/showTrashStaff', {
                layout: 'staff',
                staff: mutipleMongooseToObject(staff),
                countStaff,
                paging,
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Thùng rác bị lỗi !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = await req.body.action;
            const staffs = await isArray(req.body.staffs);
            if (!staffs) {
                req.session.message = await {
                    message: 'Lỗi dữ liệu !',
                    type: 'warning',
                };
                return res.redirect('back');
            }
            switch (action) {
                case 'delete':
                    const staffDelete = await User.delete({ _id: { $in: staffs } });
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const staffRestore = await User.restore({ _id: { $in: staffs } });
                    console.log(staffs);
                    req.session.message = await {
                        message: 'Khôi phục thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                default:
                    req.session.message = await {
                        message: 'Action thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
            }
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Action thất bại !',
                type: 'warning',
            };
            return res.redirect('back');
        }
    }
}
module.exports = new StaffController();
