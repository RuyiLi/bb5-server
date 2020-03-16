/**
 * Test endpoint to create a device and append it to the database.
 * @param device - The ID of the device to create. In reality, uuid/v4 would be used to 
 *                 generate a UUID for the device, and this route would return that UUID.
 * @param device_name - A name for the device.
 * @param device_type - See schema.
 * @param state_type - Analog (0) or digital (1).
 * @param unit - The ID of the unit this device is associated with.
 */

 module.exports = function (req, res, { device, device_name, device_type, state_type, state_value, unit }, database) {
    try {
        if (!device) throw 'Missing required "device" parameter.';
        if (!device_name) throw 'Missing required "device_name" parameter.';
        if (!device_type) throw 'Missing required "device_type" parameter.';
        if (!state_type) throw 'Missing required "state_type" parameter.';
        if (!state_value) throw 'Missing required "state_value" parameter.';
        if (!unit) throw 'Missing required "unit" parameter.';

        database.query('ADD_DEVICE', device, device_name, device_type, state_type, state_value, unit).then(function () {
            res.statusCode = 200;
            res.end(JSON.stringify({
                code: 200
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