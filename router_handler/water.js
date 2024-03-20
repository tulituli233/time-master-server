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

// 查询所有饮水类型
exports.getAllWaterTypes = (req, res) => {
    const sql = 'SELECT * FROM WaterTypes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        res.cc('获取数据成功', 1, results);
    })
}

// admin：获取饮水类型
// 参数:
// currentPage: paginationData.currentPage,
// size: paginationData.pageSize,
// WaterName: searchData.username || undefined
// 返回data,total
exports.getWaterTypes = (req, res) => {
    const currentPage = parseInt(req.query.currentPage - 1) * parseInt(req.query.size || 10);
    const size = parseInt(req.query.size || 10);
    const WaterName = req.query.WaterName ? `%${req.query.WaterName}%` : '%';
    const sql = 'select * from WaterTypes where WaterName like ? limit ?,?';
    db.query(sql, [WaterName, currentPage, size], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        const data = results || [];
        // 计算总数
        const sql = 'select count(*) as total from WaterTypes where WaterName like ?';
        db.query(sql, [WaterName], (err, results) => {
            if (err) {
                return res.cc(err, 0);
            }
            const total = results[0].total;
            res.cc('获取数据成功', 1, { data, total })
        })
    })
}

// admin：增加饮水类型
// 参数:
// WaterName: req.body.WaterName,
// WaterTip: req.body.WaterTip,
// WaterIcon: req.body.WaterIcon,
// HydratePercent: req.body.HydratePercent,
exports.addWaterType = (req, res) => {
    const sql = 'insert into WaterTypes set ?';
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

// admin：删除饮水类型
// 参数:
// WaterID: req.query.WaterID
exports.deleteWaterType = (req, res) => {
    const sql = 'delete from WaterTypes where WaterID=?';
    db.query(sql, req.query.WaterID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('删除失败', 0);
        }
        res.cc('删除成功', 1);
    })
}

// admin：修改饮水类型
// 参数:
// WaterID: req.body.WaterID
// WaterName: req.body.WaterName
// WaterTip: req.body.WaterTip
// WaterIcon: req.body.WaterIcon
// HydratePercent: req.body.HydratePercent
exports.updateWaterType = (req, res) => {
    const sql = 'update WaterTypes set ? where WaterID=?';
    db.query(sql, [req.body, req.body.WaterID], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('修改失败', 0);
        }
        res.cc('修改成功', 1);
    })
}