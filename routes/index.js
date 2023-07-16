const userRouter = require('./users.js');
const gameRouter = require('./games.js');
const uploadRouter = require('./uploads.js');
const libraryRouter = require('./libraries.js');

const router = (app) => {
    app.use('/users', userRouter);
    app.use('/games', gameRouter);
    app.use('/uploads', uploadRouter);
    app.use('/libraries', libraryRouter);
};

module.exports = router;
