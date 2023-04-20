module.exports = function PagingMiddleWare(req, res, next) {
    res.locals._page = {
        enable: false,
        pageIndex: 1,
        select: 'selected-paging',
        pageSize: 8,
    };
    if (req.query.hasOwnProperty('_page')) {
        const page = Number(req.query._page);
        Object.assign(res.locals._page, {
            enable: true,
            pageIndex: page,
        });
    }
    next();
};
