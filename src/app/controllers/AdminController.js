class AdminController {
    index(req, res) {
        res.render('admin/admin', { layout: 'admin' });
    }
}
module.exports = new AdminController();
