<?php
include 'dbcredentials.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($_GET['type']) {
    case 'game_count':
        $result = $conn->query("SELECT count(distinct(name)) as games FROM steam_games");
        $data = $result->fetch_assoc();
        echo json_encode($data);
        break;
}
?>