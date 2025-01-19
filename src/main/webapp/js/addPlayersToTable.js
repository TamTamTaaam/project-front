$(document).ready(function () {
    let totalAccounts = 0;
    let accountsPerPage = 3;
    let currentPage = 1;

    function sendRequest(page) {
        $.ajax({
            url: "/rest/players",
            type: "GET",
            data: { page: page, count: accountsPerPage },
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
        table.empty();
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

    function getCountAccounts() {
        $.ajax({
            url: "/rest/players/count",
            type: "GET",
            success: function(countAccounts) {
                totalAccounts = countAccounts;
                updatePagination();
                sendRequest(currentPage);
            },
            error: function(errors) {
                console.error("Ошибка сети: " + errors.status);
            }
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(totalAccounts / accountsPerPage);
        const paginationButtons = $('#paginationButtons');
        paginationButtons.empty();

        for (let i = 1; i <= totalPages; i++) {
            const button = $('<button></button>').text(i);
            button.on('click', function() {
                currentPage = i;
                sendRequest(currentPage);
            });
            paginationButtons.append(button);
        }
    }
    $('#countPerPage').on('change', function() {
        accountsPerPage = parseInt($(this).val());
        updatePagination();
        sendRequest(currentPage);
    });

    getCountAccounts();
});