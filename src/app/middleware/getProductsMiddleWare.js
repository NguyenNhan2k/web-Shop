module.exports = function PagingMiddleWare(req, res, next) {
    res.locals._product = {
        products: [],
    };
    const page = Number(req.query._page);
    const newStatus = [...res.locals._product.products, ...req.query.products];
    res.locals._product.products = newStatus;
    next();
};
