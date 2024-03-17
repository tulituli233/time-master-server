const express = require('express');
const joi = require('joi');
const config = require('./config');
const expressJWT = require('express-jwt');

const app = express();
// 设置请求大小
app.use(express.json({
    limit: '50mb'
}))
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}))

//响应数据的中间件
// code 1 成功 0 失败
app.use(function (req, res, next) {
    res.cc = function (err, code = 1, data = '') {
        res.send({
            code,
            msg: err instanceof Error ? err.message : err,
            data
        })
    }
    next();
})
// 跨域
const cors = require('cors');
app.use(cors());

//只能解析这种格式application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

//unless除了/ours路径，其余路径均需要进行token校验
// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

const { UnauthorizedError } = require('express-jwt/lib');
//导入自定义路由模块
// 用户
const userRouter = require('./router/user');
app.use('/users', userRouter);

// 账单
const expensesRouter = require('./router/expenses');
app.use('/expenses', expensesRouter);

// 事项、规划
const tasksRouter = require('./router/tasks');
app.use('/tasks', tasksRouter);

// 备忘录
const memoRouter = require('./router/memos');
app.use('/memos', memoRouter);

// 饮水记录
const waterRouter = require('./router/water');
app.use('/water', waterRouter);

// 日记
const diaryRouter = require('./router/diary');
app.use('/diary', diaryRouter);

// 倒计时
const countdownRouter = require('./router/countdown');
app.use('/countdown', countdownRouter);

// 书
const bookRouter = require('./router/book');
app.use('/book', bookRouter);

// app.use(function (err, req, res, next) {//错误级别中间件
//     if (err instanceof joi.ValidationError) return res.cc(err);
//     if (err.name === 'UnauthorizedError') return res.cc('身份认证失败1！')
//     res.cc(err);
// })

// 图片保存
const fs = require("fs");
app.post('/upload', (req, res) => {
    console.log('cg');
    function base64ToFile(imgD) {
        var base64 = imgD.replace(/\s/g, "+");//我的版本可能会将加号转为空格，使图片出错
        var base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
        // console.log(base64Data);
        var dataBuffer = Buffer.from(base64Data, 'base64')//新的用法 Buffer.from
        let nowTime = Date.now();
        fs.writeFile(`./uploads/images/${nowTime}.png`, dataBuffer, function (err) {
            if (err) return
            console.log('图片保存成功')
        })
        return `./uploads/images/${nowTime}.png`
    }
    let imgData = req.body.load;
    // console.log('imgData=====',typeof imgData)
    let regImg = /(data:image([a-zA-Z0-9+/=;,]+))/;
    // console.log(regImg.test(imgData))
    var ml = [];
    let newImgData = imgData;
    // console.log(ml)
    while (regImg.test(newImgData)) {
        ml = newImgData.match(regImg)
        // console.log('ml[0]=====', ml[0])
        let newUrl = base64ToFile(ml[0]);
        // console.log('newUrl=====', newUrl)
        newImgData = newImgData.replace(ml[0], newUrl)
        // console.log('newImgData=====', newImgData)
    }

    console.log('newImgData=====', newImgData)
    res.end('ok')
})

// txt读取测试
// const fs = require('fs');
const jschardet = require('jschardet');

function detectEncoding(filePath) {
    const data = fs.readFileSync(filePath);
    const result = jschardet.detect(data);
    const encoding = result.encoding;
    const confidence = result.confidence;
    return { encoding, confidence };
}

// 使用示例
const filePath = './uploads/1710679893122-我的姐姐是大明星.txt';
const { encoding, confidence } = detectEncoding(filePath);

if (encoding === 'UTF-16LE') {
    console.log('The file is using UTF-16LE encoding.');
} else if (encoding === 'UTF-8') {
    console.log('The file is using UTF-8 encoding.');
} else {
    console.log('The file encoding is unknown.');
}

app.listen(3838, () => {
    console.log('api 在3838上运行...');
})