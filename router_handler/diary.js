const db = require('../db/index');

// 获取日记diary
exports.getDiary = (req, res) => {
    const sql = 'select * from Diaries where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}

// 新增日记
exports.addDiary = (req, res) => {
    const sql = 'insert into Diaries set ?';
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