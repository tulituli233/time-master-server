const db = require('../db/index');

// 获取备忘录
exports.getMemos = (req, res) => {
    const sql = 'select * from memos where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}
// 增加备忘录
exports.addMemos = (req, res) => {
    const sql = 'insert into memos set ?';
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
// 编辑备忘录
exports.updateMemos = (req, res) => {
    const sql = 'update memos set ? where MemoID=?';
    db.query(sql, [req.body, req.body.MemoID], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('修改失败', 0);
        }
        res.cc('修改成功', 1);
    })
}

// 删除备忘录
exports.deleteMemos = (req, res) => {
    const sql = 'delete from memos where MemoID=?';
    db.query(sql, req.query.MemoID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('删除失败', 0);
        }
        res.cc('删除成功', 1);
    })
}