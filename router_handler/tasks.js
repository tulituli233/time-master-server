const db = require('../db/index');

// 新增任务
exports.addTask = (req, res) => {
    const sql = 'insert into tasks set ?';
    db.query(sql, req.body, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('添加失败', 0);
        }
        res.cc('添加成功', 1);
    })
}

exports.getTasks = (req, res) => {
    console.log('req.query=====', req.query);
    const sql = 'select * from tasks where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}