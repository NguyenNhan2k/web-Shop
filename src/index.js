const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();
const route = require('./routes');
const db = require('./config/db');
const { isArray } = require('util');
const SortMiddleWare = require('./app/middleWare/SortMiddleWare');
const PagingMiddleWare = require('./app/middleWare/pagingMiddleWare');
const SearchMiddleWare = require('./app/middleWare/SearchMiddleWare');
const port = 8002;
app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
//app.use(morgan('combined'));
//connec Ddatabase
db.connect();
app.use(SortMiddleWare);
app.use(PagingMiddleWare);
app.use(SearchMiddleWare);
// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: require('./app/helper/handlebars'),
    }),
);
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: null },
    }),
);
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    res.locals.messageCount = req.session.messageCount;
    res.locals.cart = req.session.cart;
    delete req.session.message;
    delete req.session.messageCount;
    next();
});
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// Controller Routes
route(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
