$(document).ready(function () {
    let totalAccounts = 0;
    let pageSize = 3;
    let currentPage = 1;

    function sendRequest(pageNumber) {
        $.ajax({
            url: "/rest/players",
            type: "GET",
            data:
                { pageNumber: pageNumber,
                    pageSize: pageSize,
                    _: new Date().getTime() // Добавление временной метки
                },
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
        const totalPages = Math.ceil(totalAccounts / pageSize);
        const paginationButtons = $('#paginationButtons');
        paginationButtons.empty();
        for (let i = 1; i <= totalPages; i++) {
            const button = $('<button></button>').addClass('pagination-button');
            const pageNumber = $('<span></span>').text(i);
            if (i === currentPage) {
                pageNumber.addClass('current-page');
            }
            button.append(pageNumber);
            button.on('click', function() {
                currentPage = i;
                sendRequest(currentPage);
                updatePagination();
            });

            paginationButtons.append(button);
        }
    }
    $('#countPerPage').on('change', function() {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        updatePagination();
        sendRequest(currentPage);
    });

    getCountAccounts();
});