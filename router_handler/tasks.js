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
    const sql = 'select * from tasks where UserId=?';
    db.query(sql, req.query.userID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}

// 修改tasks
exports.updateTask = (req, res) => {
    console.log('req.body=====', req.body);
    // 根据TaskId修改tasks,将Status改为新的Status
    const sql = 'update tasks set ? where TaskID=?';
    db.query(sql, [req.body, req.body.TaskID], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        console.log('修改结果=====', results);
        if (results.affectedRows !== 1) {
            return res.cc('修改失败', 0);
        }
        res.cc('修改成功', 1);
    })
}