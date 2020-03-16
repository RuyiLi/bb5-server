/**
 * Retrieves the state of the specified device.
 * @param device - The ID of the device.
 * @return The state of the device as a JSON object, with state_type and state_value.
 */

module.exports = function (req, res, { device }, database) {
    database.query('GET_DEVICE_STATE', device).then(function ({ rows }) {
        if (!device) throw 'Missing required "device" parameter.';
        if (rows.length === 0) throw 'Invalid device ID.';

        res.writeHead(200, {
            'Content-Type': 'text',
        });
        res.end(JSON.stringify({
            code: 200,
            device_state: rows[0],
        }));
    }).catch(function (err) {
        console.error(err);
        res.writeHead(400, err);
        res.end(JSON.stringify({
            code: 400,
            message: err,
        }));
    });
}