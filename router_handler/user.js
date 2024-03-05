const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
exports.regUser = (req, res) => {
    const userinfo = req.body;
    const sqlStr = 'select * from users where Username=?';
    db.query(sqlStr, userinfo.Username, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        // //用户名已存在
        if (results.length > 0) {
            return res.cc('用户名已被占用，请更换其他用户名！', 301);
        }
        // console.log(2);
        //用户名可用
        // userinfo.Password = bcrypt.hashSync(userinfo.Password, 10);
        const sqladd = 'insert into users set ?';
        db.query(sqladd, { Username: userinfo.Username, Password: userinfo.Password }, (err, results) => {
            if (err) {
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                return res.cc('用户注册失败！请稍后再试！', 301);
            }
            res.cc('注册成功！', 200);
        })
    })
}

exports.login = (req, res) => {
    const userinfo = req.body;
    let sqllogin = '';
    sqllogin = 'select * from users where Username=?';
    db.query(sqllogin, userinfo.Username, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('登陆失败,该用户不存在！');
        const compareResult = userinfo.Password === results[0].Password;
        if (!compareResult) {
            return res.cc('登陆失败，密码错误！', 301);
        }
        const id = results[0].UserId;
        const user = { id, Username: userinfo.Username };
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '24h',
        });
        res.cc('登录成功！',200,'Bearer ' + tokenStr)
    })
}
