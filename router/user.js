const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const userHander=require('../router_handler/user');
const expressJoi=require('@escook/express-joi');
const {reg_login_schema}=require('../schema/user');

// router.get('/reguser',expressJoi(reg_login_schema),userHander.regUser);

router.post('/reguser',expressJoi(reg_login_schema),userHander.regUser);

router.post('/login',expressJoi(reg_login_schema),userHander.login);

module.exports=router;