SELECT state_type, state_value 
FROM devices
WHERE device_id = $1;