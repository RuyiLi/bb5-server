/**
 * Returns the states of all devices connected to a unit
 * @param unit - The UUID of the unit
 * @return The states of all devices conencted to this unit.
 */
module.exports = function (req, res, { unit }, database) {
    database.query('DEVICES_ON_UNIT', unit).then(function ({ rows }) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        }).end(JSON.stringify({ units: rows }));
    }).catch(function (err) {
        console.error(err);
        res.writeHead(400, 'Invalid unit ID')
            .end();
    });
}