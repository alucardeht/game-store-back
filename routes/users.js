import express from "express";

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond from users');
});

export default router;
