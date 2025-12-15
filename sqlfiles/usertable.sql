use 2025F_bergebro;

CREATE TABLE User_Setting (
    uid INT NOT NULL,
    login VARCHAR(100) NOT NULL,
    slider_low_value INT NOT NULL,
    slider_high_value INT NOT NULL,
    datetime DATETIME NOT NULL,
    PRIMARY KEY (uid),
    CONSTRAINT fk_user_setting
        FOREIGN KEY (uid)
        REFERENCES steam_users(uid)
        ON DELETE CASCADE
);

ALTER TABLE User_Setting
ADD COLUMN platform VARCHAR(10) NOT NULL DEFAULT 'all';

update User_Setting set platform = "Linux" where uid = 1;

select * from User_Setting;