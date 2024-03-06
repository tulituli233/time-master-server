const db = require('../db/index');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.addExpenses = (req, res) => {
    console.log('req.body=====', req.body);
    const sql = 'insert into expenses set ?';
    db.query(sql, req.body, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('添加失败', 0);
        }
        res.cc('添加成功');
    })
}

exports.getExpenses = (req, res) => {
    const sql = 'select * from expenses where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}