<?php
include 'dbcredentials.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($_GET['type']) {
    case 'game_count':
        $result = $conn->query("SELECT count(distinct(name)) as games FROM steam_games; ");
        $data = $result->fetch_assoc();
        echo json_encode($data);
        break;
    case 'line_chart':
        $result = $conn->query("SELECT year(release_date) as year, count(appid) as count from steam_games where release_date is not null group by year(release_date);");
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;
}
?>