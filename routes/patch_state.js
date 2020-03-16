/**
 * Modifies the state of a device.
 * @param device - The ID of the device.
 * @param type - 0 for analog, 1 for digital
 * @param value - A range between 1 and 100 for analog, and 
 *                0 for off and 1 for on for digital.
 * @return 200 OK
 */

module.exports = async function (req, res, { device, type, value }, database) {
    try {
        if (!device) throw 'Missing required "device" parameter.';
        if (!type) throw 'Missing required "type" parameter.';
        if (!value) throw 'Missing required "value" parameter.';

        database.query('SET_DEVICE_STATE', type, value, device).then(function () {
            res.statusCode = 200;
            res.end(JSON.stringify({
                code: 200,
            }));
        }).catch(err => { throw err });
    } catch (err) {
        console.error(err);
        res.writeHead(400, err);
        res.end(JSON.stringify({
            code: 400,
            message: err,
        }));
    }
}