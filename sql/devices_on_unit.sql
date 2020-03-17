SELECT *
FROM devices
WHERE unit_id = $1
ORDER BY device_id ASC;