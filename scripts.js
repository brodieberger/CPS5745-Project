
function start() {
    fetch("api.php?type=game_count").then(response => response.json())
        .then(data => {
            console.log(data); // Use the data, e.g., to update the UI
            document.getElementById("game_number").innerHTML = data.games;
        })
        .catch(error => {
            console.error('Error:', error);
        });

}