module.exports = (price) => {
    return (Math.ceil(eval(price) / 1000) * 1000).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
}