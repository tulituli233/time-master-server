const db = require('../db/index');
const fs = require('fs');

// 上传txt文件并保存小说章节内容
const uploadBook = (novelID, filePath, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.cc(err, 0);
        }
        // 使用正则表达式匹配章节标题
        const chapters = data.split(/第(?:[零一二三四五六七八九十百千\d]+)章/g);
        // console.log('chapters=====', chapters);
        // 去掉第一个空内容
        chapters.shift();
        // 重新在每个章节开头加上章节标题
        let formattedChapters = [];
        chapters.forEach((chapter, index) => {
            console.log('Buffer.byteLength(chapter)=====', Buffer.byteLength(chapter));
            if (Buffer.byteLength(chapter) > 30000) {
                const splitChapters = [];
                while (Buffer.byteLength(chapter) > 20000) {
                    const splitChapter = chapter.slice(0, 20000);
                    splitChapters.push(splitChapter);
                    chapter = chapter.slice(20000);
                }
                if (chapter.length > 0) {
                    splitChapters.push(chapter); // Add the remaining part as a separate chapter
                }
                splitChapters.forEach((splitChapter, i) => {
                    formattedChapters.push('第' + (index + 1) + '章' + '(' + (i + 1) + ')' + splitChapter);
                });
            } else {
                formattedChapters.push('第' + (index + 1) + '章' + chapter);
            }
        });
        console.log('formattedChapters.length=====', formattedChapters.length);
        // console.log('formattedChapters=====', formattedChapters[0]);
        // console.log('formattedChapters=====', formattedChapters[1]);
        // 保存每个章节到数据库
        const totalChapters = formattedChapters.length;
        let savedChapters = 0;
        formattedChapters.forEach((chapter, index) => {
            // 使用正则表达式匹配章节标题,例如：第1章 开始 
            const chapterTitleMatch = chapter.match(/第(?:[零一二三四五六七八九十百千\d]+)章\s*(\S{1,20})/);
            console.log('chapterTitleMatch=====', chapterTitleMatch[1]);
            // 一共有多少章
            console.log('chapters.index=====', index);
            const chapterTitle = chapterTitleMatch[1] || '未知章节';
            // const chapterContent = chapter.replace(chapterTitle, '').trim();
            const chapterData = {
                NovelID: novelID,
                ChapterNumber: index + 1,
                ChapterTitle: chapterTitle,
                ChapterContent: chapter,
            };
            db.query('INSERT INTO NovelChapters SET ?', chapterData, (err, result) => {
                if (err) {
                    console.error('Error saving chapter:', err);
                    res.cc(err, 0);
                    return;
                } else {
                    // console.log('Chapter saved:', result.insertId);
                    savedChapters++;
                    if (savedChapters === totalChapters) {
                        console.log('All chapters saved successfully');
                        res.cc('小说上传成功', 1);
                    }
                }
            });

        });
    });
}


// 创建小说
exports.createNovel = (req, res) => {
    // 去掉.txt
    const title = req.file.originalname.slice(0, -4);
    const author = '未知';
    const query = 'INSERT INTO Novels (Title, Author, CreatedAt, UpdatedAt) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
    db.query(query, [title, author], (err, result) => {
        if (err) {
            console.error('Error creating novel:', err);
            res.cc(err, 0);
        } else {
            console.log('Novel created successfully:', result.insertId);
            const filePath = req.file.path; // 请替换成实际的文件路径
            uploadBook(result.insertId, filePath, res);
        }
    });
}

// 获取小说
exports.getNovels = (req, res) => {
    const sql = 'select * from novels';
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}

// 获取小说章节
exports.getNovelChapter = (req, res) => {
    if (req.query.ChapterID) {
        const sql = 'select * from NovelChapters where ChapterID=?';
        db.query(sql, req.query.ChapterID, (err, results) => {
            if (err) {
                return res.cc(err, 0);
            }
            console.log('results=====', results);
            res.cc('获取数据成功', 1, results);
        });
    } else if (req.query.NovelID) {
        const sql = 'select * from NovelChapters where NovelID=? and ChapterNumber=1';
        db.query(sql, req.query.NovelID, (err, results) => {
            if (err) {
                return res.cc(err, 0);
            }
            res.cc('获取数据成功', 1, results);
        });
    } else {
        // Handle case when neither chapterID nor novelID is provided
        res.cc('参数错误', 0);
    }
}

// 获取小说目录
exports.getNovelChapters = (req, res) => {
    // 只要小说章节的ChapterID，ChapterTitle，ChapterNumber
    const sql = 'select ChapterID, ChapterTitle, ChapterNumber from NovelChapters where NovelID=?';
    db.query(sql, req.query.NovelID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        console.log('getNovelChapters-results=====', results);
        res.cc('获取数据成功', 1, results)
    })
}