const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const waterHander=require('../router_handler/water');
const expressJoi=require('@escook/express-joi');

// 增加饮水记录
router.post('/add',waterHander.addWater);
// 查询饮水记录
router.get('/list',waterHander.getWater);
// 查询饮水类型
router.get('/allTypes',waterHander.getAllWaterTypes);
// admin：获取饮水类型
router.get('/types',waterHander.getWaterTypes);
// admin：增加饮水类型
router.post('/addType',waterHander.addWaterType);
// admin：删除饮水类型
router.get('/deleteType',waterHander.deleteWaterType);
// admin：修改饮水类型
router.post('/updateType',waterHander.updateWaterType);

module.exports=router;