const Size = require('../model/Size');
const Customer = require('../model/Customer');
const Cart = require('../model/Cart');
const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');

var cart = {
    items: [],
    add: (payload) => {
        const index = parseInt(payload.index);
        if (cart.items.length == 0) {
            cart.items.push(payload);
        } else {
            if (cart.items[index - 1].product._id.equals(payload.product._id)) {
                cart.items[index - 1].quantity = parseInt(cart.items[index - 1].quantity) + parseInt(payload.quantity);
            } else {
                cart.items.push(payload);
            }
        }
    },
    count: () => {
        return cart.items.length;
    },
    delete: (index) => {
        const curIndex = parseInt(index) - 1;
        cart.items.splice(curIndex, 1);
    },
    update: (product) => {
        cart.items.push(product);
    },
    clear: () => {
        cart.items = [];
    },
    index: 0,
};
class CartController {
    async index(req, res) {
        try {
            const cartProduct = await cart.items;
            const flagUser = false;
            if (req.user) {
                const { id } = await req.user;
                var cartOfUser = await Cart.find({ id_user: id }).populate([
                    {
                        path: 'product',
                        model: 'Size',
                        populate: {
                            path: 'id_product',
                            model: 'Product',
                        },
                    },
                ]);
                return res.render('shop/cart', {
                    layout: 'main',
                    cartOfUser: mutipleMongooseToObject(cartOfUser),
                });
            }
            return res.render('shop/cart', {
                layout: 'main',
                cart: cartProduct,
            });
        } catch (err) {
            console.log(err);
        }
    }
    async order(req, res) {
        try {
            if (!req.user) {
                req.session.message = await {
                    message: 'Vui lòng đăng nhập để đặt hàng',
                    type: 'warning',
                };
                res.redirect('back');
            }
            const cartOfUser = await Cart.find({ id_user: req.user.id }).populate([
                {
                    path: 'product',
                    model: 'Size',
                    populate: {
                        path: 'id_product',
                        model: 'Product',
                    },
                },
            ]);
            const customer = await Customer.findOne({ _id: req.user.id });
            if (req.user && cartOfUser) {
                return res.render('shop/order', {
                    layout: 'main',
                    cartOfUser: mutipleMongooseToObject(cartOfUser),
                    userOrder: mongooseToObject(customer),
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    async delete(req, res) {
        try {
            if (req.user === undefined) {
                const paramsProduct = await req.params.id.split('&');
                const idPro = (await paramsProduct) ? paramsProduct[0] : null;
                const indexPro = (await paramsProduct) ? paramsProduct[1] : null;
                await cart.delete(indexPro);
                req.session.message = await {
                    message: 'Xóa sản phẩm thành công!',
                    type: 'success',
                };
                res.redirect('back');
            } else if (req.user) {
                const deleteProductInCart = await Cart.findByIdAndDelete({ _id: req.params.id });
                req.session.message = await {
                    message: 'Xóa sản phẩm thành công!',
                    type: 'success',
                };
                res.redirect('back');
            } else {
                req.session.message = await {
                    message: 'Xóa thất bại!',
                    type: 'warning',
                };
                res.redirect('back');
            }
        } catch (err) {
            req.session.message = await {
                message: 'Xóa thất bại!',
                type: 'warning',
            };
            res.redirect('back');
        }
    }
    async update(req, res) {
        try {
            if (req.user === undefined) {
                const convertProduct = Array.isArray(req.body.quantity)
                    ? req.body
                    : {
                          quantity: [req.body.quantity],
                          size: [req.body.size],
                      };
                console.log(req.body);
                const products = await Size.find({ _id: { $in: convertProduct.size } }).populate('id_product');
                await cart.clear();
                console.log('clear gio hang', cart.items);

                for (let i = 0; i < products.length; i++) {
                    const objCart = await {
                        product: products[i],
                        quantity: convertProduct.quantity[i],
                        index: cart.index + 1,
                    };
                    await cart.update(objCart);
                }
                console.log('gio hang moi', cart.items);
            } else if (req.user) {
                const convertProduct = Array.isArray(req.body.quantity)
                    ? req.body
                    : {
                          quantity: [req.body.quantity],
                          size: [req.body.size],
                      };
                console.log(convertProduct);

                for (let i = 0; i < convertProduct.quantity.length; i++) {
                    const saveCart = await Cart.updateOne(
                        { _id: convertProduct.size[i] },
                        { quantity: convertProduct.quantity[i] },
                    );
                    console.log(saveCart);
                }
            }
            req.session.message = await {
                message: 'Cập nhật giỏ hàng thành công!',
                type: 'success',
            };
            return res.redirect('back');
        } catch (err) {
            console.log(err);
        }
    }
    async add(req, res) {
        try {
            if (req.body.size === undefined) {
                req.session.message = await {
                    message: 'Thêm vào giỏ hàng lỗi!',
                    type: 'warning',
                };
                return res.redirect('back');
            }
            if (req.user === undefined) {
                const product = await Size.findOne({ _id: req.body.size }).populate('id_product');
                if (product.count == 0) {
                    req.session.message = await {
                        message: 'Sản phẩm không đủ!',
                        type: 'warning',
                    };
                    return res.redirect('back');
                }
                const objCart = await {
                    product,
                    quantity: req.body.quantity,
                    index: cart.index + 1,
                };
                res.locals.countCart = await cart.count;
                await cart.add(objCart);
                req.session.message = await {
                    message: 'Đã thêm vào giỏ hàng!',
                    type: 'success',
                };
                return res.redirect('back');
            } else if (req.user) {
                const { id, roles } = await req.user;
                const productInCart = await Cart.findOne({ product: req.body.size });
                const product = await Size.findOne({ _id: req.body.size }).populate('id_product');
                if (product.count < req.body.quantity) {
                    req.session.message = await {
                        message: 'Sản phẩm không đủ!',
                        type: 'warning',
                    };
                    return res.redirect('back');
                }
                if (productInCart) {
                    const checkP = await Cart.updateOne(
                        { _id: productInCart._id },
                        { $inc: { quantity: req.body.quantity } },
                    );
                } else if (!productInCart) {
                    const productCart = await new Cart({
                        id_customer: id,
                        quantity: req.body.quantity,
                        product: req.body.size,
                    });
                    await productCart.save();
                    if (req.query.hasOwnProperty('_buyNow')) {
                        return res.redirect('/cart/order');
                    }
                }
                const countCart = await Cart.count({ id_customer: id });
                req.session.message = await {
                    message: 'Đã thêm vào giỏ hàng!',
                    type: 'success',
                };
                res.redirect('back');
            }
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new CartController();
