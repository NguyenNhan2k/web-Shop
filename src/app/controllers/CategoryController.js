const Size = require('../model/Size');
const Category = require('../model/Category');
const Products = require('../model/Products');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

class CategoryController {
    async showCategory(req, res, next) {
        try {
            const category = await Category.find({}).search(req).paginal(req, res).sortable(req);
            const countCategory = await Category.countDeleted({});
            const searchCategory = await Category.find({});
            const pagingCategory = await Category.count({});
            const SIZE_PAGE = res.locals._page.pageSize;
            const countPaging = Math.ceil(pagingCategory / SIZE_PAGE);
            const paging = [];
            for (let i = 0; i < countPaging; i++) {
                paging[i] = i + 1;
            }
            res.render('staff/category', {
                layout: 'staff',
                category: mutipleMongooseToObject(category),
                searchCategory: mutipleMongooseToObject(searchCategory),
                countCategory,
                paging,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }
    async showCategoryDetail(req, res, next) {
        try {
            const reqSlug = req.params.slug;
            await Category.findOne({ _id: reqSlug }).then((detail) =>
                res.render('staff/showDetail', {
                    layout: 'staff',
                    category: mongooseToObject(detail),
                }),
            );
        } catch (error) {
            console.log(error);
        }
    }
    async showCategoryCreate(req, res, next) {
        try {
            return res.render('staff/createCategory', {
                layout: 'staff',
            });
        } catch (err) {
            console.log(err);
        }
    }
    async showTrash(req, res, next) {
        try {
            const categories = await Category.findDeleted({}).populate({
                path: 'deleteBy',
                model: 'User',
            });
            console.log(categories);
            res.render('staff/showTrashCategory', {
                layout: 'staff',
                categories: mutipleMongooseToObject(categories),
            });
        } catch (err) {
            console.log(err);
        }
    }
    async createCategory(req, res, next) {
        try {
            const bodyReq = req.body.category.trim();
            const result = await Category.findOne({ name: bodyReq });
            if (result) {
                req.session.message = await {
                    message: 'Trùng tên danh mục !',
                    type: 'warning',
                };
                return res.redirect(`back`);
            } else {
                const newCategory = await Category({
                    name: bodyReq,
                });
                const message = {
                    message: 'Tạo danh mục thành công',
                };
                await newCategory.save();
                req.session.message = await {
                    message: 'Tạo danh mục thành công !',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async update(req, res, next) {
        try {
            const reqName = await req.body.category.trim();
            const reqBodyId = await req.body._id;
            const category = await Category.findById(reqBodyId);
            const categories = await Category.find();
            const index = await categories.map((category) => category.name).indexOf(category.name);
            if (category) {
                for (let i = 0; i < categories.length; i++) {
                    if (i == index) {
                        continue;
                    }
                    if (categories[i].name === reqName) {
                        req.session.message = await {
                            message: 'Trùng tên danh mục !',
                            type: 'warning',
                        };
                        return res.redirect(`back`);
                    }
                }
                category.name = reqName ? reqName : category.name;
                category.save();
                req.session.message = await {
                    message: 'Update danh mục thành công!',
                    type: 'success',
                };
                return res.redirect(`back`);
            }
            req.session.message = await {
                message: 'Update danh mục thất bại!',
                type: 'waning',
            };
            return res.redirect(`back`);
        } catch (error) {
            console.log(error);
        }
    }
    async destroy(req, res, next) {
        try {
            const idCategory = await req.params.slug;
            const { id, roles } = await req.userStaff;

            if (idCategory) {
                const result = await Category.delete({ _id: idCategory });
                await Category.updateOneDeleted({ _id: idCategory }, { deleteBy: id });
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
        } catch (err) {}
    }
    async restore(req, res, next) {
        try {
            const reqId = req.params.slug;
            const result = await Category.restore({ _id: reqId });
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
            console.log(err);
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
            const categories = (await Array.isArray(req.body.categories)) ? req.body.categories : [req.body.categories];
            console.log(categories);
            const { id, roles } = await req.userStaff;
            switch (action) {
                case 'delete':
                    const resultOne = await Category.delete({ _id: { $in: categories } });
                    for (let category of categories) {
                        const deleteBy = await Category.updateOneDeleted({ _id: category }, { deleteBy: id });
                    }
                    req.session.message = await {
                        message: 'Xóa thành công!',
                        type: 'success',
                    };
                    return res.redirect('back');
                case 'restore':
                    const resultTwo = await Category.restore({ _id: { $in: categories } });
                    if (resultTwo) {
                        req.session.message = await {
                            message: 'Khôi phục thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    break;
                case 'force':
                    const resultTree = await Category.findDeleted({ _id: { $in: categories } });
                    if (resultTree && roles === 'admin') {
                        for (let category of categories) {
                            await Products.updateMany({ category: category }, { $set: { category: null } });
                        }
                        await Category.deleteMany({ _id: { $in: categories } });
                        req.session.message = await {
                            message: 'Xóa thành công !',
                            type: 'success',
                        };
                        return await res.redirect(`back`);
                    }
                    req.session.message = await {
                        message: 'Bạn không có quyền Admin !',
                        type: 'warning',
                    };

                    return res.redirect('back');
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
    async forceDestroy(req, res, next) {
        try {
            const reqId = await req.params.slug;
            if (reqId) {
                await Category.deleteOne({ _id: reqId });
                await Products.updateMany({ category: reqId }, { $set: { category: null } });
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
module.exports = new CategoryController();
