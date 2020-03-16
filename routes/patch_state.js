module.exports = async function (req, res, { device, type, value }, database) {
    try {
        if (!device) throw 'Missing required "device" parameter.';
        if (!type) throw 'Missing required "type" parameter.';
        if (!value) throw 'Missing required "value" parameter.';

        database.query('SET_DEVICE_STATE', type, value, device).then(function () {
            res.end();
        });
    } catch (err) {
        console.error(err);
        res.writeHead(400, err);
        res.end(JSON.stringify({
            code: 400,
            message: err,
        }));
    }
}