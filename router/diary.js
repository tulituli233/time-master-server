const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const diaryHander=require('../router_handler/diary');
const expressJoi=require('@escook/express-joi');

// 查询日记
router.get('/list',diaryHander.getDiary);
// 增加日记
router.post('/add',diaryHander.addDiary);
// 修改日记
router.post('/update',diaryHander.updateDiary);
// 删除日记
router.get('/delete',diaryHander.deleteDiary);

module.exports=router;