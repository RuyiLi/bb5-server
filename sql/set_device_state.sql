UPDATE devices
SET state_type = $1, state_value = $2
WHERE device_id = $3;