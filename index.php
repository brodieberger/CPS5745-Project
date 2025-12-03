<?php
include 'dbcredentials.php';
$conn->close();
?>


<html>

<body>
    <h1>Hello</h1>
    <p id="game_number">value here</p>


    <div style="max-height: 80%; margin: auto; display: flex; justify-content: center;">
        <canvas id="myChart"></canvas>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="scripts.js"></script>
    <script>
        window.onload = start;
    </script>
</body>

</html>