require('dotenv/config');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");
const createError = require("http-errors");
const cors = require('cors');

const routes = require("./routes/index.js");
const {connect} = require("./database/db.js");

const app = express();

connect().then(() => {
    app.use(cors({
        origin: process.env.FRONT_END_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }));
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    routes(app);

    app.use(function (req, res, next) {
        next(createError(404));
    });

    app.use(function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.send({
            message: err.message,
        });
    });

    const port = process.env.SERVER_PORT || 3000;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to the database:', error);
});

module.exports = app;
