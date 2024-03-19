const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const expensesHander=require('../router_handler/expenses');
const expressJoi=require('@escook/express-joi');

// 新增expenses
router.post('/add',expensesHander.addExpenses);
// 查询expenses
router.get('/list',expensesHander.getExpenses);
// 查询expensesCategory
router.get('/cateList',expensesHander.getExpensesCategory);
// 新增expensesCategory
router.post('/addCate',expensesHander.addExpensesCategory);
// 修改expensesCategory
router.post('/updateCate',expensesHander.updateExpensesCategory);
// 删除expensesCategory
router.get('/deleteCate',expensesHander.deleteExpensesCategory);
// 获取所有expensesCategory
router.get('/allCate',expensesHander.getAllExpensesCategory);

module.exports=router;