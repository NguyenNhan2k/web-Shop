const Customers = require('../model/Customer');
const bcrypt = require('bcrypt');
class RegisterController {
    index(req, res) {
        res.render('shop/register');
    }
    async createUser(req, res) {
        try {
            const body = req.body;
            const newUser = await new Customers({
                name: body.name,
                address: body.address,
                email: body.email,
                phone: body.phone,
                password: body.password,
            });
            const checkUser = await Customers.findOne({ email: newUser.email });
            if (!checkUser) {
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(newUser.password, salt);
                await newUser.save();
                req.session.message = await {
                    message: 'Đăng ký thành công !',
                    type: 'success',
                };
                return res.status(201).redirect('back');
            } else {
                req.session.message = await {
                    message: 'Tài khoản đã tồn tại',
                    type: 'warning',
                };
                return res.status(201).redirect('back');
            }
        } catch (error) {
            req.session.message = await {
                message: 'Tạo tài khoản không thành công !',
                type: 'warning',
            };
            return res.status(500).redirect('back');
        }
    }
}
module.exports = new RegisterController();
