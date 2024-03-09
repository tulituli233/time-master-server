const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const waterHander=require('../router_handler/water');
const expressJoi=require('@escook/express-joi');

// 增加饮水记录
router.post('/add',waterHander.addWater);
// 查询饮水记录
router.get('/list',waterHander.getWater);

module.exports=router;