const { mutipleMongooseToObject, mongooseToObject } = require('../../until/moogose');
class DashBoardController {
    async index(req, res) {
        try {
            return res.render('staff/dashboard', {
                layout: 'staff',
            });
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new DashBoardController();
