const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const expensesHander=require('../router_handler/expenses');
const expressJoi=require('@escook/express-joi');

// 新增expenses
router.post('/add',expensesHander.addExpenses);
// 查询expenses
router.get('/list',expensesHander.getExpenses);

module.exports=router;