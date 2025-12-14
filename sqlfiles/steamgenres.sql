use 2025F_bergebro;

drop table steam_genres;
truncate steam_genres;

CREATE TABLE steam_genres (
    appid INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    average_playtime_forever INT,
    PRIMARY KEY (appid, genre),
    FOREIGN KEY (appid) REFERENCES steam_games(appid)
);

INSERT INTO steam_genres (appid, genre, average_playtime_forever)
SELECT
    s.appid,
    TRIM(
        SUBSTRING_INDEX(
            SUBSTRING_INDEX(
                REPLACE(REPLACE(REPLACE(s.genres, '[', ''), ']', ''), '"', ''),
                ',', n.n
            ),
            ',', -1
        )
    ) AS genre,
    s.average_playtime_forever
FROM steam_games s
JOIN (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6
) n
ON CHAR_LENGTH(s.genres) - CHAR_LENGTH(REPLACE(s.genres, ',', '')) >= n.n - 1
WHERE s.genres IS NOT NULL
  AND s.genres <> '[]'
  AND TRIM(s.genres) <> '';


DELETE FROM steam_genres
WHERE genre = 'Sexual Content'
   OR genre IS NULL;

SELECT genre, COUNT(*) AS game_count, AVG(average_playtime_forever) AS avg_playtime
FROM steam_genres
GROUP BY genre
HAVING game_count > 1000
ORDER BY game_count DESC;

SELECT
    genre,
    AVG(average_playtime_forever) AS avg_playtime
FROM steam_genres
GROUP BY genre
HAVING COUNT(*) > 1000
ORDER BY avg_playtime DESC;


select g.appid, sg.genre, g.release_date from steam_genres sg join steam_games g on sg.appid = g.appid 
where release_date is not null
AND YEAR(g.release_date) BETWEEN 1997 AND 1999
order by release_date;

SELECT sg.genre,
COUNT(*) AS game_count
FROM steam_genres sg
JOIN steam_games g ON sg.appid = g.appid
WHERE g.release_date IS NOT NULL AND YEAR(g.release_date) BETWEEN 2011 AND 2014
GROUP BY sg.genre
HAVING game_count > 1000
ORDER BY game_count DESC
