use 2025F_bergebro;

CREATE TABLE genre_count_by_year AS
SELECT
    YEAR(s.release_date) AS year,
    g.genre,
    COUNT(*) AS genre_count
FROM steam_games s
JOIN steam_genres g ON s.appid = g.appid
WHERE s.release_date IS NOT NULL
GROUP BY year, g.genre
ORDER BY year;

select * from genre_count_by_year;