const db = require('../db/index');

// 新增倒计时
exports.addCountdown = (req, res) => {
    const sql = 'insert into Countdowns set ?';
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

// 获取倒计时
exports.getCountdown = (req, res) => {
    const sql = 'select * from Countdowns where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}