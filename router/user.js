const express=require('express');
const res = require('express/lib/response');
const router=express.Router();
const userHander=require('../router_handler/user');
const expressJoi=require('@escook/express-joi');
const {reg_login_schema}=require('../schema/user');

router.post('/reguster', userHander.reguster);

router.post('/login', userHander.login);

module.exports=router;