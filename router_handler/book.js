const db = require('../db/index');
const fs = require('fs');
const jschardet = require('jschardet');

// 读取文件并检测文件编码
const detectEncoding = (filePath) => {
    const data = fs.readFileSync(filePath);
    const result = jschardet.detect(data);
    const encoding = result.encoding;
    const confidence = result.confidence;
    return { encoding, confidence };
}

// 上传txt文件并保存小说章节内容
const uploadBook = (novelID, filePath, encoding, res) => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.cc(err, 0);
        }
        // 使用正则表达式匹配章节标题
        const chapters = data.split(/第(?:[零一二三四五六七八九十百千\d]+)章/g);
        // 重新在每个章节开头加上章节标题
        let formattedChapters = [];
        chapters.forEach((chapter, index) => {
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
        // 保存每个章节到数据库
        const totalChapters = formattedChapters.length;
        let savedChapters = 0;
        formattedChapters.forEach((chapter, index) => {
            // 使用正则表达式匹配章节标题,例如：第1章 开始 
            const chapterTitleMatch = chapter.match(/第(?:[零一二三四五六七八九十百千\d]+)章\s*(\S{1,20})/);
            // console.log('chapterTitleMatch=====', chapterTitleMatch[1]);
            // 一共有多少章
            // console.log('chapters.index=====', index);
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
                }
                console.log('Chapter saved:', result);
                if (result.affectedRows !== 1) {
                    console.error('Error saving chapter:', result);
                    return;
                }
                // console.log('Chapter saved:', result.insertId);
                savedChapters++;
                if (savedChapters === totalChapters) {
                    console.log('All chapters saved successfully');
                    fs.unlinkSync(filePath);
                    res.cc('小说上传成功', 1);
                }

            });
        });
    });
}

// 章节分割
const splitChapter = (chapter) => {
    const splitChapters = [];
    while (Buffer.byteLength(chapter) > 20000) {
        const splitChapter = chapter.slice(0, 20000);
        splitChapters.push(splitChapter);
        chapter = chapter.slice(20000);
    }
    if (chapter.length > 0) {
        splitChapters.push(chapter); // Add the remaining part as a separate chapter
    }
    return splitChapters;
}

// 创建小说
exports.createNovel = (req, res) => {
    // console.log('req.file=====', req.file);
    const { encoding, confidence } = detectEncoding(req.file.path);

    if (encoding === 'UTF-16LE') {
        console.log('The file is using UTF-16LE encoding.');
    } else if (encoding === 'UTF-8') {
        console.log('The file is using UTF-8 encoding.');
    } else {
        console.log('The file encoding is unknown.');
        // 删除上传的文件
        fs.unlinkSync(req.file.path);
        return res.cc('文件编码不支持', 0);
    }
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
            uploadBook(result.insertId, filePath, encoding, res);
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

// 根据小说ID和ChapterNumber获取小说章节
exports.getNovelChapter = (req, res) => {
    // console.log('req.query=====', req.query);
    const sql = 'select * from NovelChapters where NovelID=? and ChapterNumber=?';
    db.query(sql, [req.query.NovelID, req.query.ChapterNumber], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}

// 获取小说目录
exports.getNovelChapters = (req, res) => {
    // 只要小说章节的ChapterID，ChapterTitle，ChapterNumber并且按照ChapterNumber升序排列
    const sql = 'select ChapterID, ChapterTitle, ChapterNumber from NovelChapters where NovelID=? order by ChapterNumber asc';
    db.query(sql, req.query.NovelID, (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        res.cc('获取数据成功', 1, results)
    })
}

// 根据chapterID修改小说章节内容
exports.updateNovelChapter = (req, res) => {
    // console.log('req.body=====', req.body);
    const sql = 'update NovelChapters set ChapterContent=? where ChapterID=?';
    db.query(sql, [req.body.ChapterContent, req.body.ChapterID], (err, results) => {
        if (err) {
            return res.cc(err, 0);
        }
        if (results.affectedRows !== 1) {
            return res.cc('修改失败', 0);
        }
        res.cc('修改成功', 1)
    })
}