const jwt = require('jsonwebtoken');
const User = require('../model/User');

const middlewareController = {
    verifyAdmin: (req, res, next) => {
        const accessToken = req.cookies.assesTokenStaff;
        if (accessToken) {
            jwt.verify(accessToken, 'secret-key', (err, user) => {
                if (err) {
                    res.status(403).json('you not a token');
                }
                if (user.roles === 'admin') {
                    req.userStaff = user;
                    return next();
                }
                req.session.message = {
                    message: 'Không có quyền Admin',
                    type: 'warning',
                };
                return res.redirect(`back`);
            });
        } else {
            req.session.message = {
                message: 'Không có quyền Admin',
                type: 'warning',
            };
            return res.redirect(`back`);
        }
    },
    verifyStaff: (req, res, next) => {
        const accessToken = req.cookies.assesTokenStaff;
        if (accessToken) {
            jwt.verify(accessToken, 'secret-key', (err, user) => {
                if (err) {
                    return res.redirect(`back`);
                }
                const name = user.name.split(' ').slice(-1).join();
                const newName = name[0].toUpperCase() + name.slice(1);
                user.name = newName;
                req.userStaff = user;
                res.locals.userStaff = user;
                return next();
            });
        } else {
            res.redirect(`/login`);
        }
    },
    verifyUser: (req, res, next) => {
        const accessToken = req.cookies.assesTokenUser;
        if (accessToken) {
            jwt.verify(accessToken, 'secret-key', (err, user) => {
                if (err) {
                    res.redirect(`/login`);
                }
                req.user = user;
                const name = user.name.split(' ').slice(-1).join();
                const newName = name[0].toUpperCase() + name.slice(1);
                user.name = newName;
                req.user = user;
                res.locals.user = user;
                return next();
            });
        } else {
            next();
        }
    },
};
module.exports = middlewareController;
