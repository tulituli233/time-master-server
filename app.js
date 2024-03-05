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
app.use(function (req, res, next) {
    res.cc = function (err, status = 444,data='') {
        res.send({
            meta: {
                status,
                message: err instanceof Error ? err.message : err
            },
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
const userRouter = require('./router/user');
app.use('/users', userRouter);

// const userinfoRouter = require('./router/userinfo');
// app.use('/my', userinfoRouter);

// const cartRouter = require('./router/cart');
// app.use('/my/cart', cartRouter);

// const homeRouter = require('./router/home');
// app.use('/my/home', homeRouter);

// const ordersRouter = require('./router/orders');
// app.use('/my/orders', ordersRouter);

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


app.listen(3838, () => {
    console.log('api 在3838上运行...');
})