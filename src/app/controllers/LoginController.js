const Customer = require('../model/Customer');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../until/moogose');
async function accessToken(user) {
    try {
        if (user) {
            const result = await jwt.sign(
                {
                    id: user.id,
                    roles: user.roles,
                    name: user.name,
                    avatar: user.images,
                },
                'secret-key',
                { expiresIn: '365d' },
            );
            return result;
        }
    } catch (error) {
        return error;
    }
}
class LoginController {
    index(req, res) {
        res.render('shop/login');
    }
    async login(req, res) {
        try {
            const reqBody = await req.body;
            const customer = await Customer.findOne({ email: reqBody.email });
            const user = customer || (await User.findOne({ email: reqBody.email }));
            const validPassword = user && (await bcrypt.compare(reqBody.password, user.password));
            if (user !== null && validPassword) {
                const { password, ...other } = await user._doc;
                const role = await other.roles;
                if (role === 'user') {
                    const accessTokenUser = await accessToken(user);
                    await res.cookie('assesTokenUser', accessTokenUser, {
                        path: '/',
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict',
                    });
                    req.session.message = await {
                        message: 'Đăng nhập thành công!',
                        type: 'success',
                    };
                    return res.redirect('/');
                } else if (role === 'staff' || role === 'admin') {
                    const accessTokenStaff = await accessToken(user);
                    const name = await other.name.split(' ').slice(-1).join('');
                    await res.cookie('assesTokenStaff', accessTokenStaff, {
                        path: '/',
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict',
                    });
                    req.session.message = await {
                        message: 'Đăng nhập thành công!',
                        type: 'success',
                    };
                    return res.redirect('/dashboard');
                }
            } else {
                req.session.message = await {
                    message: 'Đăng nhập thất bại!',
                    type: 'warning',
                };
                return res.redirect('back');
            }
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new LoginController();
