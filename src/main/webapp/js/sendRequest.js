$(document).ready(function () {
    function sendRequest() {
        $.ajax({
            url: "/rest/players",
            type: "GET",
            success: function(listPlayers) {
                addPlayersToTable(listPlayers);
            },
            error: function(errors) {
                console.error("Ошибка сети: " + errors.status);
            }
        });
    }
    function addPlayersToTable(listPlayers) {
        var table = $('#rpgTable tbody');
        $.each(listPlayers, function(index, player) {
            var row = $('<tr></tr>');
            var playerData = [
                player.id,
                player.name,
                player.title,
                player.race,
                player.profession,
                player.level,
                player.birthday,
                player.banned
            ];
            $.each(playerData, function(i, data) {
                row.append($('<td></td>').text(data));
            });
            table.append(row);
        });
    }
    sendRequest();
});
