/**
 * Returns the states of all devices connected to a unit
 * @param unit - The UUID of the unit
 * @return The states of all devices conencted to this unit.
 */
module.exports = function (req, res, { unit }, database) {
    database.query('DEVICES_ON_UNIT', unit).then(function ({ rows }) {
        if (!unit) throw 'Missing required "unit" parameter.';
        if (rows.length === 0) throw 'Invalid unit ID.';

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
            code: 200,
            units: rows 
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