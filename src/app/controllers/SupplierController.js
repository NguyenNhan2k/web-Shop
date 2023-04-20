const Supplier = require('../model/Supplier');
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
class SupplierController {
    async showIndex(req, res, next) {
        var suppliers = await Supplier.find({}).sortable(req).paginal(req, res);
        const pagingSupplier = await Supplier.count({});
        const countSupplier = await Supplier.countDeleted({});
        const SIZE_PAGE = res.locals._page.pageSize;
        const countPaging = Math.ceil(pagingSupplier / SIZE_PAGE);
        const paging = [];
        for (let i = 0; i < countPaging; i++) {
            paging[i] = i + 1;
        }
        try {
            return res.render('staff/showSupplier', {
                layout: 'staff',
                supplier: mutipleMongooseToObject(suppliers),
                countSupplier,
                paging,
            });
        } catch (err) {}
    }
    async showCreate(req, res, next) {
        try {
            return res.render('staff/showCreateSupplier', {
                layout: 'staff',
            });
        } catch (err) {
            console.log(err);
        }
    }
    async create(req, res, next) {
        try {
            var suppliers = await Supplier.find({});

            const supplier = await req.body;
            supplier.name.trim();
            for (let i = 0; i < suppliers.length; i++) {
                if (suppliers[i].name.trim() === supplier.name) {
                    req.session.message = await {
                        message: 'Trùng tên nhà cung cấp !',
                        type: 'warning',
                    };
                    return res.redirect('back');
                }
            }
            const saveSupplier = await new Supplier(supplier);
            await saveSupplier.save();
            req.session.message = await {
                message: 'Thêm NCC thành công !',
                type: 'success',
            };
            return res.redirect('back');
        } catch (err) {
            console.log(err);
        }
    }
    async showDetail(req, res, next) {
        try {
            const supplier = await Supplier.findOne({ _id: req.params.slug });
            if (supplier) {
                return res.render('staff/showDetailSupplier', {
                    layout: 'staff',
                    supplier: mongooseToObject(supplier),
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    async showTrash(req, res, next) {
        try {
            const supplier = await Supplier.findDeleted().sortable(req).paginal(req, res);
            if (supplier) {
                return res.render('staff/showTrashSupplier', {
                    layout: 'staff',
                    supplier: mutipleMongooseToObject(supplier),
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    async restore(req, res, next) {
        try {
            const idSupplier = await req.params.id;
            const supplier = await Supplier.restore({ _id: idSupplier });
            if (supplier) {
                req.session.message = await {
                    message: 'Khôi phục thành công!',
                    type: 'success',
                };
                return res.redirect(`back`);
            } else {
                await supplier.restore();
                req.session.message = await {
                    message: 'Khôi phục thất bại!',
                    type: 'waning',
                };
                return res.redirect(`back`);
            }
        } catch (err) {
            console.log(err);
        }
    }
    async update(req, res, next) {
        try {
            const supplier = await Supplier.findOne({ _id: req.body._id });
            const suppliers = await Supplier.find();
            const validSupplier = await getIndex(supplier, suppliers, req.body.name);
            const { id, roles } = req.user;
            if (validSupplier) {
                supplier.name = await req.body.name;
                supplier.phone = await req.body.phone;
                supplier.address = await req.body.address;
                supplier.email = await req.body.email;
                await supplier.save();
                await Supplier.updateOne({ _id: supplier._id }, { $push: { updateBy: id } });
                req.session.message = await {
                    message: 'Update NCC thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Update NCC thất bại !',
                type: 'warning',
            };
            return res.redirect(`/supplier/${req.body.name}`);
        } catch (err) {
            console.log(err);
        }
    }
    async destroy(req, res, next) {
        try {
            const idDelete = await req.params.id;
            if (idDelete) {
                const deleteSupplier = await Supplier.delete({ _id: idDelete });
                const { id, roles } = req.user;
                console.log(id);
                await Supplier.updateOneDeleted({ _id: idDelete }, { $push: { deleteBy: id } });
                req.session.message = await {
                    message: 'Xóa NCC thành công !',
                    type: 'success',
                };
                return res.redirect('back');
            }
            req.session.message = await {
                message: 'Xóa NCC thất bại!',
                type: 'warning',
            };
            return res.redirect('back');
        } catch (err) {
            console.log(err);
        }
    }
    async handleAction(req, res, next) {
        try {
            const action = req.body.action;
            const supplier = req.body.suppliers;
            console.log(req.body);
            switch (action) {
                case 'delete':
                    const resultOne = await Supplier.delete({ _id: { $in: supplier } });
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Supplier.restore({ _id: { $in: supplier } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'forceDestroy':
                    console.log(req.body);
                    const resultThree = await Supplier.remove({ _id: { $in: supplier } });
                    if (resultThree) {
                        req.session.message = await {
                            message: 'Xóa thành công !',
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
module.exports = new SupplierController();
