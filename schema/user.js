const joi=require('joi');

const leixing=joi.string().min(1).required();
const Username=joi.string().alphanum().min(2).max(20).required();
const Password=joi.string().pattern(/^[\S]{5,18}$/).required();

exports.reg_login_schema={
    body:{
        Username,
        Password
    }
}

const id=joi.number().integer().min(1).required();
const nickname=joi.string().required();
const address=joi.string().required();
const phone=joi.string().pattern(/^[0-9]{6,11}$/).required();
const email=joi.string().email().required();

exports.updata_userinfo_schema={
    body:{
        nickname,
        address,
        phone
    }
}

exports.updata_password_schema={
    body:{
        oldpwd:Password,
        newpwd:joi.not(joi.ref('oldpwd')).concat(Password)
    }
}

const avatar=joi.string().dataUri().required();

exports.updata_avatar_schema={
    body:{
        avatar
    }
}