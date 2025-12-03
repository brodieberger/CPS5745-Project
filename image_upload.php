<?php
if (isset($_FILES['myimage'])) {
  $file = $_FILES['myimage'];

  if ($file['error'] === UPLOAD_ERR_OK) {

    $check = getimagesize($file['tmp_name']);
    if ($check == false) {
      echo "File is not an image.";
    } else {
      $imageData = base64_encode(file_get_contents($file['tmp_name']));
      $src = 'data:' . $check['mime'] . ';base64,' . $imageData;
      echo '<img id="scream" src="' . $src . '" alt="The Scream" style="display: none" />';
    }

  } else {
    echo "Error uploading file.";
  }
} else {
  echo "No image was uploaded.";
}
?>

<html>

<body style="margin: auto; width: 80%; text-align: center">
  <h1>Click and Drag to Select Pixels</h1>

  <div style="max-height: 50%;">
    <canvas id="myCanvas" onmousemove="showCoords(event)" onmousedown="mouseDown(event)" onmouseup="mouseUp(event)">
    </canvas>
  </div>

  <div>
    <label><input type="checkbox" id="redCheckbox" checked> Red</label>
    <label><input type="checkbox" id="greenCheckbox" checked> Green</label>
    <label><input type="checkbox" id="blueCheckbox" checked> Blue</label>
  </div>

  <p id="demo">Coordinates:</p>
  <p id="rgb">RGB:</p>
  <?php
  echo "<p>File: " . htmlspecialchars($file['name']);
  echo ", Type: " . htmlspecialchars($check['mime']);
  echo ", Size: " . htmlspecialchars($file['size']) . " bytes</p>";
  ?>

  <h1>Percentage of RGB values in Pixels</h1>
  <p id="chartText">Select Pixels to get Started</p>
  <div style="max-height: 80%; margin: auto; display: flex; justify-content: center;">
    <canvas id="myChart"></canvas>
  </div>

  <a href="/CPS5745-Study2/">Go Back</a>

  <form action="save_data.php" method="POST">
    <label for="myimage">Save Data:</label>
    <input type="hidden" id="pixelData" name="pixelData" value=""> <!-- Hidden input -->
    <input type="hidden" id="imageSizeData" name="imageSizeData" value="">
    <input type="hidden" id="fileName" name="fileName" value="<?php echo htmlspecialchars($file['name']);?>">
    <button type="submit">Save</button>
    <label for="showOutput">Show Data:</label>
    <input type="checkbox" id="showOutput" name="showOutput" value="true">

  </form>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="rgb-scripts.js"></script>
  <script>window.onload = renderImage;</script>
</body>

</html>