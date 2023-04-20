module.exports = function SortMiddleWare(req, res, next) {
    res.locals._search = {
        enable: false,
    };
    if (req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._search, {
            enable: true,
            slug: req.query.slug,
        });
    }
    next();
};
