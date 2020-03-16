module.exports = function (req, res, { device, type, value }, database) {
    database.query('SET_DEVICE_STATE', type, value, device).then(function () {
        res.writeHead(200).end();
    }).catch(function (err) {
        console.error(err);
        res.writeHead(400).end(err);
    });
}