const Customers = require('../model/Customer');
const Cart = require('../model/Cart');
const Order = require('../model/Order');
const bcrypt = require('bcrypt');

const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

class CustomerController {
    async index(req, res, next) {
        try {
            const customers = await Customers.find({}).paginal(req, res).sortable(req).search(req);
            const countCustomer = await Customers.countDeleted({ roles: 'user' });
            const search = await Customers.find({});
            const pagingCustomer = await Customers.count({ roles: 'user' });
            const SIZE_PAGE = await res.locals._page.pageSize;
            const countPaging = await Math.ceil(pagingCustomer / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = (await i) + 1;
            }
            return res.render('staff/customer', {
                layout: 'staff',
                customers: mutipleMongooseToObject(customers),
                search: mutipleMongooseToObject(search),
                countCustomer,
                paging,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async showDetail(req, res, next) {
        try {
            const reqCustomerId = await req.params.id;
            const customer = reqCustomerId && (await Customers.findOne({ _id: reqCustomerId }));
            if (customer) {
                return res.render('staff/showDetailCustomer', {
                    layout: 'staff',
                    customer: mongooseToObject(customer),
                });
            }
        } catch (next) {
            console.log(next);
        }
    }
    async update(req, res, next) {
        try {
            const customer = await req.body;
            var uploadFile;
            if (req.file) {
                uploadFile = await req.file.originalname;
            }
            customer.images = (await uploadFile) ? req.file.originalname : req.body.img;
            const newUser = await Customers.findOne({ _id: req.user.id });

            if (newUser) {
                newUser.name = await customer.name;
                newUser.email = await customer.email;
                newUser.phone = await customer.phone;
                newUser.address = await customer.address;
                newUser.images = await customer.images;
                await newUser.save();

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
    async destroy(req, res) {
        try {
            const reqId = req.params.id;
            const { id, rolse } = req.userStaff;
            const result = await Customers.delete({ _id: reqId });
            await Customers.updateOneDeleted({ _id: reqId }, { deletedBy: id });
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
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
            console.log(err);
        }
    }
    async showTrash(req, res, next) {
        try {
            const customers = await Customers.findDeleted().paginal(req, res).sortable(req).populate('deletedBy');
            const countCustomer = await Customers.countDeleted();
            const pagingCustomer = await Customers.count();
            const SIZE_PAGE = await res.locals._page.pageSize;
            const countPaging = await Math.ceil(pagingCustomer / SIZE_PAGE);
            const paging = await [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = (await i) + 1;
            }
            return res.status(200).render('staff/showTrashCustomer', {
                layout: 'staff',
                customers: mutipleMongooseToObject(customers),
                countCustomer,
                paging,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async restore(req, res, next) {
        try {
            const reqId = await req.params.id;
            const { id } = await req.userStaff;
            const result = await Customers.restore({ _id: reqId });
            await Customers.updateOneDeleted({ _id: reqId }, { restoredBy: id });
            if (result) {
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
    async showCreate(req, res, next) {
        try {
            return res.render('staff/showCreateCustomer', {
                layout: 'staff',
            });
        } catch (err) {
            console.log(err);
            req.session.message = await {
                message: 'Thêm khách hàng thất bại !',
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
            const isEmail = await Customers.findOne({ email: email });
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
            const staffModel = await new Customers({
                name,
                phone,
                email,
                address,
                password: password,
                images: uploadFile,
            });
            staffModel.password = await bcrypt.hash(password, salt);
            console.log(staffModel);
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
    async forceDestroy(req, res, next) {
        try {
            const reqId = await req.params.id;
            if (reqId) {
                const deleteP = await Customers.deleteOne({ _id: reqId });
                await Cart.deleteMany({ id_customer: reqId });
                await Order.deleteMany({ id_user: reqId });
                await res.clearCookie('assesTokenUser', { patch: '/' });
                await delete res.locals.user;
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
            req.session.message = await {
                message: 'Xóa thất bại !',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = req.body.action;
            const customers = req.body.customers;
            switch (action) {
                case 'delete':
                    const resultOne = await Customers.delete({ _id: { $in: customers } });
                    resultOne;
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Customers.restore({ _id: { $in: customers } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'force':
                    const { id, roles } = req.userStaff;

                    if (roles === 'admin') {
                        const resultTree = await Customers.deleteMany({ _id: { $in: customers } });
                        if (resultTree) {
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
                        return await res.redirect(`back`);
                    }
                    req.session.message = await {
                        message: 'Không có quyền Admin !',
                        type: 'warning',
                    };
                    return await res.redirect(`back`);
                default:
                    req.session.message = await {
                        message: 'Action thất bại !',
                        type: 'warning',
                    };
                    return res.redirect('back');
            }
        } catch (err) {
            req.session.message = await {
                message: 'Action thất bại !',
                type: 'warning',
            };
            return res.redirect('back');
        }
    }
    async logout(req, res, next) {
        try {
            await res.clearCookie('assesTokenUser', { path: '/' });
            await delete req.session.user;
            req.session.message = await {
                message: 'Đăng xuất thành công !',
                type: 'success',
            };
            return res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    }
    async showInfo(req, res, next) {
        try {
            const idCustomer = await Customers.findOne({ _id: req.user.id });
            return res.render('shop/info', {
                layout: 'main',
                customer: mongooseToObject(idCustomer),
            });
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new CustomerController();
