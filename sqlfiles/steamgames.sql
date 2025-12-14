use 2025F_bergebro;

select * from steam_games limit 10;
select * from steam_games order by peak_ccu desc limit 10;

select * from steam_games where metacritic_score <> 0 order by metacritic_score asc limit 10;
select * from steam_games where positive > 1000 and negative > 1000 order by (positive/negative) desc limit 10;
select appid, name, positive, negative, ((positive)/(positive+negative)*100) as rating from steam_games  where positive > 1000 and negative > 1000 order by (positive/negative) desc limit 20;

select count(distinct(name)) from steam_games;
select count(name) from steam_games;
select count(name) from steam_games where genres like "%Racing%";

select count(distinct(genres)) from steam_games;
select distinct(genres) from steam_games;

select * from steam_games where release_date is not NULL order by release_date asc limit 100;

select * from steam_games where name like "%Team Fortress 2%";
select * from steam_games where genres like "%Free%" and year(release_date) < 2008;

select year(release_date), count(appid) from steam_games where release_date is not null group by year(release_date);

#playtime
select name, average_playtime_forever from steam_games where recommendations > 1000 order by average_playtime_forever desc;