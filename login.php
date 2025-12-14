<?php
session_start();
include 'dbcredentials.php';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare(
    "SELECT uid, password_hash FROM steam_users WHERE username = ?"
);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (hash('sha256', $password) === $row['password_hash']) {
        $_SESSION['uid'] = $row['uid'];
        $_SESSION['username'] = $username;

        echo json_encode(["success" => true]);
        exit;
    }
}

http_response_code(401);
echo json_encode(["success" => false, "message" => "Invalid login"]);
?>