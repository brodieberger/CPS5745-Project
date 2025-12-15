<?php
session_start();
include 'dbcredentials.php';

header("Content-Type: application/json");

if (!isset($_SESSION['uid'], $_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uid = (int)$_SESSION['uid'];
$login = $_SESSION['login'];

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit;
}

/* GET: Load saved settings */
if ($method === 'GET') {
    $stmt = $conn->prepare(
        "SELECT slider_low_value, slider_high_value, platform
         FROM User_Setting
         WHERE uid = ?"
    );
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "found" => true,
            "slider_low" => $row['slider_low_value'],
            "slider_high" => $row['slider_high_value'],
            "platform" => $row['platform']
        ]);
    } else {
        echo json_encode(["found" => false]);
    }
    exit;
}

/* POST: Save settings */
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    $low = (int)($input['slider_low'] ?? 1997);
    $high = (int)($input['slider_high'] ?? 2024);
    $platform = $input['platform'] ?? 'all';

    $check = $conn->prepare("SELECT uid FROM User_Setting WHERE uid = ?");
    $check->bind_param("i", $uid);
    $check->execute();
    $exists = $check->get_result()->num_rows > 0;

    if ($exists) {
        $stmt = $conn->prepare(
            "UPDATE User_Setting
             SET slider_low_value = ?, slider_high_value = ?, platform = ?, datetime = NOW()
             WHERE uid = ?"
        );
        $stmt->bind_param("iisi", $low, $high, $platform, $uid);
    } else {
        $stmt = $conn->prepare(
            "INSERT INTO User_Setting
             (uid, login, slider_low_value, slider_high_value, platform, datetime)
             VALUES (?, ?, ?, ?, ?, NOW())"
        );
        $stmt->bind_param("isiss", $uid, $login, $low, $high, $platform);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
    exit;
}
?>
