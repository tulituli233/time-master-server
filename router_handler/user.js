const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 注册
exports.reguster = (req, res) => {
    console.log('req.body=====', req.body);
    const userinfo = req.body;
    const sqlStr = 'select * from users where Phone=?';
    db.query(sqlStr, userinfo.Phone, (err, results) => {
        if (err) return res.cc(err, 0);
        if (results.length === 1) return res.cc('该用户已存在');
        userinfo.Password = bcrypt.hashSync(userinfo.Password, 10);
        console.log('userinfo=====', userinfo);
        const sql = 'insert into users set ?';
        db.query(sql, userinfo, (err, results) => {
            if (err) return res.cc(err, 0);
            if (results.affectedRows !== 1) return res.cc('注册失败', 0);
            res.cc('注册成功', 1);
        })
    })
}

// 登录
exports.login = (req, res) => {
    const userinfo = req.body;
    const sql = 'select * from users where Phone=?';
    db.query(sql, userinfo.Phone, (err, results) => {
        if (err) return res.cc(err, 0);
        if (results.length === 0) return res.cc('用户不存在', 0);
        const compareResult = bcrypt.compareSync(userinfo.Password, results[0].Password);
        if (!compareResult) return res.cc('密码错误', 0);
        // 生成token
        const user = {...results[0], Password: '', user_pic: '' };
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        res.cc('登录成功', 1, { token: tokenStr, ...user });
    })
}