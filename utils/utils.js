// 将时间戳转换为2021-06-01
exports.timestampToTime = (timestamp) => {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return Y + M + D
}

// 将时间戳转换为周几
exports.getWeek = (date) => {
    let week = new Date(date).getDay() === 0 ? '周日' : '周' + '日一二三四五六'.charAt(new Date(date).getDay())
    return week
}

// 格式化时间，格式为 YYYY-MM-DD
exports.formatDate = (date) => {
    date = new Date(date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}
// 格式化时间，格式为 YYYY-MM-DD HH:mm:ss
exports.formatDateTime = (date) => {
    date = new Date(date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
    return `${formattedDate} ${formattedTime}`;
}