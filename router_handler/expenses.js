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

// 查询expensesCategory
// 参数:
// currentPage: paginationData.currentPage,
// size: paginationData.pageSize,
// CategoryType: 0,
// CategoryName: searchData.username || undefined
// 返回data,total
exports.getExpensesCategory = (req, res) => {
    const sql = 'select * from expensesCategory where CategoryType=? and CategoryName like ? limit ?,?';
    const CategoryType = req.query.CategoryType || 0;
    const CategoryName = req.query.CategoryName ? `%${req.query.CategoryName}%` : '%';
    const currentPage = parseInt(req.query.currentPage - 1) * parseInt(req.query.size || 10);
    const size = parseInt(req.query.size || 10);
    db.query(sql, [CategoryType, CategoryName, currentPage, size], (err, results) => {
        if (err) {
            console.log('err=====', err);
            return res.cc(err, 0);
        }
        const data = results || [];
        // 计算总数
        const sql = 'select count(*) as total from expensesCategory where CategoryType=? and CategoryName like ?';
        db.query(sql, [CategoryType, CategoryName], (err, results) => {
            if (err) {
                return res.cc(err, 0);
            }
            const total = results[0].total;
            res.cc('获取数据成功', 1, { data, total })
        })
    })
}

// 新增expensesCategory
exports.addExpensesCategory = (req, res) => {
    const sql = 'insert into expensesCategory set ?';
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

// 编辑updateExpensesCategory
exports.updateExpensesCategory = (req, res) => {
    const sql = 'update expensesCategory set ? where CategoryID=?';
    db.query(sql, [req.body, req.body.CategoryID], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('修改失败', 0);
        }
        res.cc('修改成功');
    })
}

// 删除expensesCategory
// 参数:
// CategoryID
exports.deleteExpensesCategory = (req, res) => {
    console.log('req.query=====', req.query);
    const sql = 'delete from expensesCategory where CategoryID=?';
    db.query(sql, req.query.CategoryID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('删除失败', 0);
        }
        res.cc('删除成功');
    })
}

// 获取所有expensesCategory
// 参数:
// CategoryType
exports.getAllExpensesCategory = (req, res) => {
    const sql = 'select * from expensesCategory';
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}