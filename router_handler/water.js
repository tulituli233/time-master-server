const db = require('../db/index');
const { formatDate } = require('../utils/utils');

// 增加饮水记录
exports.addWater = (req, res) => {
    const sql = 'insert into WaterRecords set ?';
    db.query(sql, req.body, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.affectedRows !== 1) {
            return res.cc('添加失败', 0);
        }
        res.cc('添加成功', 1);
    })
}

// 查询指定用户当天的饮水记录
exports.getWater = (req, res) => {
    let date = formatDate(new Date());
    console.log('date=====', date);
    console.log('req.query.userID=====', req.query.userID);
    const sql = 'SELECT * FROM WaterRecords WHERE UserId=? AND DateTime LIKE ?';
    // 数据库
    db.query(sql, [req.query.userID, '%' + date + '%'], (err, results) => {
        if (err) {
            return res.cc(err);
        }
        res.cc('获取数据成功', 1, results);
    })
}