const Handlebars = require('Handlebars');
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);
module.exports = {
    sum: (preIndex, index) => preIndex + index,
    convertToDate: (date) => {
        const result = new Date(date);
        return result.toLocaleString();
    },
    countSize: (payload) => {
        if (payload.length > 0) {
            const quantity = payload.reduce((pre, cur) => {
                return pre + cur.count;
            }, 0);
            return quantity;
        } else {
            return 0;
        }
    },
    getOneImg: (payload) => {
        const oneImg = payload[1];
        return oneImg;
    },
    sale: (exportPrice, sale) => {
        const priceSale = (exportPrice * sale) / 100;
        const priceExport = exportPrice - priceSale;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(priceExport);
        return formated;
    },
    salePrice: (exportPrice, sale) => {
        const priceSale = (exportPrice * sale) / 100;
        const priceExport = exportPrice - priceSale;
        return priceExport;
    },
    getTitleCart: (cart) => {
        return cart.id_product.title;
    },
    getIdCart: (cart) => {
        return cart._id;
    },
    getImgCart: (cart) => {
        return cart ? cart.id_product.img[0] : cart;
    },
    totalPriceCart: (cart) => {
        const totalPrice = cart.reduce((init, cur, index) => {
            const price = cur.product.id_product.export_price;
            const sale = (price * cur.product.id_product.sale) / 100;
            const priceExport = (price - sale) * cur.quantity;
            return init + priceExport;
        }, 0);
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(totalPrice);
        return formated;
    },
    totalPrice: (cart) => {
        const totalPrice = cart.reduce((init, cur, index) => {
            const price = cur.product.id_product.export_price;
            const sale = (price * cur.product.id_product.sale) / 100;
            const priceExport = (price - sale) * cur.quantity;
            return init + priceExport;
        }, 0);
        return totalPrice;
    },
    getPriceCart: (cart) => {
        const price = cart.id_product.export_price;
        const sale = (price * cart.id_product.sale) / 100;
        const totalPrice = price - sale;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(totalPrice);
        return formated;
    },
    getNameSizeCart: (cart) => {
        return cart.name;
    },
    getTotalPriceCart: (price, quantity) => {
        const priceCart = price.id_product.export_price;
        const sale = (priceCart * price.id_product.sale) / 100;
        const totalPrice = (priceCart - sale) * quantity;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(totalPrice);
        return formated;
    },
    getQuantityCart: (cart) => {
        return cart.quantity;
    },
    checkDisableSize: (payload) => {
        var eleDisable;
        if (payload == 0) {
            eleDisable = 'disable--Size';
        }
        return eleDisable;
    },
    priceSale: (exportPrice, sale) => {
        const priceSale = (exportPrice * sale) / 100;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(priceSale);
        return formated;
    },
    convertToVND: (payload) => {
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(payload);
        return formated;
    },
    totalReceiptExport: (payload) => {
        const total = payload.reduce((pre, cur) => {
            const totalMoney = cur.count * cur.export_price;
            const totalReceipt = pre + totalMoney;
            return totalReceipt;
        }, 0);
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(total);
        return formated;
    },
    totalOrder: (payload) => {
        const total = payload.reduce((pre, cur) => {
            const totalMoney = cur.quantity * cur.export_price;
            const totalReceipt = pre + totalMoney;
            return totalReceipt;
        }, 0);
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(total);
        return formated;
    },
    totalMoney: (exportPrice, count) => {
        const total = exportPrice * count;
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(total);
        return formated;
    },
    getSize: (arrSize, nameSize) => {
        if (arrSize.length > 0) {
            var temp = '';
            const sizes = arrSize.map((size) => {
                if (size.name === nameSize) {
                    temp += size.detail;
                    return 0;
                }
            });
            return temp;
        }
    },
    handleAddProduct: (products) => {
        const newProducts = products.map((product) => {
            const output = {
                title: product.title,
                id: product._id,
                size: product.size,
            };
            return output;
        });
        return JSON.stringify(newProducts);
    },
    handleAddSupplier: (supplier) => {
        return JSON.stringify(supplier);
    },
    getCountSize: (count) => {
        return count;
    },

    checkNullStatus: (status) => {
        return status ? status.name : 'Đang chờ xác nhận đơn!';
    },
    sortable: (field, sort) => {
        const isType = ['asc', 'desc'];

        const sortType = field === sort.column && isType.includes(sort.type) ? sort.type : 'default';
        const icons = {
            default: 'fa-solid fa-sort sort',
            asc: 'fa-solid fa-arrow-down-wide-short',
            desc: `fa-solid fa-arrow-up-wide-short`,
        };
        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };
        const icon = icons[sortType];
        const type = types[sortType];
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

        const output = `
            <a href="${href}"><i class="${icon}"></i> </a>`;
        return new Handlebars.SafeString(output);
    },
    pageView: (page, paging) => {
        const arrPage = paging.map((index) => {
            const checkSelect = page.pageIndex === index ? page.select : '';
            return `<li class="paging_ground ${checkSelect}"><a href="?_page=${index}">${index}</a></li>`;
        });
        const prePage = page.pageIndex === 1 && page.pageIndex > 0 ? page.pageIndex : page.pageIndex - 1;
        const nextPage = page.pageIndex === paging.length ? 1 : page.pageIndex + 1;
        const newOutput =
            `<li class="paging_ground"><a href="?_page=${prePage}">
            <i class="fa-solid fa-backward"></i></a> </li>` +
            arrPage.join(' ') +
            `<li class="paging_ground"><a href="?_page=${nextPage}"><i class="fa-solid fa-forward"></i></a></li>`;
        return newOutput;
        // const output = index + 1 === page.pageIndex ? 'paging_ground' + page.select : 'paging_ground';
    },
    timeAgo: (time) => {
        const timeAgo = new TimeAgo('en-US');
        const date = new Date(time);
        return timeAgo.format(date - 29 * 1000, 'round');
    },
    rateStar: (rate) => {
        let txt = '';
        for (let i = 0; i < rate; i++) {
            txt += `<i class="fa-solid fa-star" data-rate="1"></i>`;
        }
        return txt;
    },
    totalRate: (rates) => {
        const newRate = rates.reduce((init, cur, index) => {
            return init + cur.rate;
        }, 0);
        const output = parseFloat(newRate) / parseFloat(rates.length);
        return output;
    },
};
