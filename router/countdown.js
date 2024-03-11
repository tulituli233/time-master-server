const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const countdownHander=require('../router_handler/countdown');
const expressJoi=require('@escook/express-joi');

// 查询倒计时
router.get('/list',countdownHander.getCountdown);
// 增加倒计时
router.post('/add',countdownHander.addCountdown);

module.exports=router;