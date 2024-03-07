const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const tasksHander=require('../router_handler/tasks');
const expressJoi=require('@escook/express-joi');

// 新增tasks
router.post('/add',tasksHander.addTask);
// 查询tasks
router.get('/list',tasksHander.getTasks);
// 修改tasks
router.post('/update',tasksHander.updateTask);

module.exports=router;