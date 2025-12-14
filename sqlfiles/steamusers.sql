CREATE TABLE steam_users (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

INSERT INTO steam_users (username, password_hash)
VALUES ('brodie', SHA2('pass', 256));

select * from steam_users;