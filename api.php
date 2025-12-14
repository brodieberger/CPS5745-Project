<?php
session_start();

if (!isset($_SESSION['uid'])) {
    http_response_code(401);
    echo json_encode(["error" => "Please login to the database first."]);
    exit;
}

include 'dbcredentials.php';


$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

header("Content-Type: application/json");

// ---------- Read Filters ----------
$yearLow = isset($_GET['year_low']) ? intval($_GET['year_low']) : 1990;
$yearHigh = isset($_GET['year_high']) ? intval($_GET['year_high']) : 2030;
$platform = $_GET['platform'] ?? 'all';

$platformSql = '';
if ($platform === 'windows') {
    $platformSql = 'AND g.windows = 1';
} elseif ($platform === 'mac') {
    $platformSql = 'AND g.mac = 1';
} elseif ($platform === 'linux') {
    $platformSql = 'AND g.linux = 1';
}

// ---------- Helper WHERE clause ----------
function baseWhere($yearLow, $yearHigh)
{
    $where = "
        WHERE g.release_date IS NOT NULL
          AND YEAR(g.release_date) BETWEEN $yearLow AND $yearHigh
    ";

    return $where;
}

// ---------- Router ----------
$type = $_GET['type'] ?? '';

switch ($type) {

    // ---------- Total Game Count ----------
    case 'game_count':
        $sql = "
            SELECT COUNT(DISTINCT g.appid) AS games
            FROM steam_games g
        ";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_assoc());
        break;

    // ---------- Bar Chart: Games per Year ----------
    case 'bar_chart':
        $sql = "
      SELECT YEAR(g.release_date) AS year, COUNT(*) AS count
      FROM steam_games g
      WHERE g.release_date IS NOT NULL
        AND YEAR(g.release_date) BETWEEN $yearLow AND $yearHigh
        $platformSql
      GROUP BY year
      ORDER BY year
    ";
        $result = $conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;


    // ---------- Pie Chart: Genre Distribution ----------
    case 'pie_chart':
        $sql = "
      SELECT sg.genre, COUNT(*) AS game_count
      FROM steam_genres sg
      JOIN steam_games g ON sg.appid = g.appid
      WHERE g.release_date IS NOT NULL
        AND YEAR(g.release_date) BETWEEN $yearLow AND $yearHigh
        $platformSql
      GROUP BY sg.genre
      ORDER BY game_count DESC
    ";
        $result = $conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;


    // ---------- Scatter Chart: Popularity vs Playtime ----------
    case 'scatter_chart':
        $sql = "
      SELECT
        sg.genre,
        COUNT(*) AS game_count,
        ROUND(AVG(sg.average_playtime_forever), 2) AS avg_playtime
      FROM steam_genres sg
      JOIN steam_games g ON sg.appid = g.appid
      WHERE g.release_date IS NOT NULL
        AND YEAR(g.release_date) BETWEEN $yearLow AND $yearHigh
        AND sg.average_playtime_forever IS NOT NULL
        $platformSql
      GROUP BY sg.genre
      ORDER BY game_count DESC
    ";
        $result = $conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;


    // ---------- Invalid Type ----------
    default:
        echo json_encode(["error" => "Invalid API request"]);
        break;
}

$conn->close();
?>