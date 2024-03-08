const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const memosHander=require('../router_handler/memos');
const expressJoi=require('@escook/express-joi');

// 查询memos
router.get('/list',memosHander.getMemos);
// 增加memos
router.post('/add',memosHander.addMemos);

module.exports=router;