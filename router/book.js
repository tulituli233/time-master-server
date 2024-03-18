const express = require('express');
const res = require('express').response;
const router = express.Router();
const bookHander = require('../router_handler/book');
const expressJoi = require('@escook/express-joi');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb) {
        // 指定存储的文件名为当前时间戳加上原始文件名
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

// 上传txt文件
router.post('/upload', upload, bookHander.createNovel);

// 获取小说列表
router.get('/list', bookHander.getNovels);

// 获取小说章节
router.get('/chapter', bookHander.getNovelChapter);

// 获取小说目录
router.get('/chapters', bookHander.getNovelChapters);

// 更新小说章节
router.post('/updateChapter', bookHander.updateNovelChapter);

module.exports = router;