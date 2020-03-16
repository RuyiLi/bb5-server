DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS devices;

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(25) NOT NULL
);

CREATE TABLE units (
    unit_id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE devices (
    device_id INT PRIMARY KEY,
    device_name VARCHAR(50) NOT NULL,
    state_type INT NOT NULL,  /* Can be either 0 for analog or 1 for digital */
    state_value INT NOT NULL, 
    /* 
        For analog, 0 or 1
        For digital, 0 to 100
    */
    unit_id INT,
    FOREIGN KEY (unit_id) REFERENCES units (unit_id)
);