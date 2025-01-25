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

            var deleteImage = $('<img>')
                .attr('src', '../img/delete.png')
                .attr('alt', 'Delete')
                .css({ width: '20px', height: '20px', cursor: 'pointer' })
                .on('click', function(id) {
                    var playerId = player.id;
                    $.ajax({
                        url: "/rest/players/" + playerId,
                        type: "DELETE",
                        success: function() {
                            row.remove();
                            table.append(row);
                        },
                        error: function(errors) {
                            console.error("Ошибка сети: " + errors.status);
                        }
                    });
                });

            var editImage = $('<img>')
                .attr('src', '../img/edit.png')
                .attr('alt', 'Edit')
                .css({ width: '20px', height: '20px', cursor: 'pointer' })
                .on('click', function() {
                    if ($(this).attr('alt') === 'Edit') {
                        $(this).attr('src', '../img/save.png').attr('alt', 'Save');
                        row.find('td').each(function(index) {
                            var cell = $(this);
                            var currentValue = cell.text().trim();
                            if ([1, 2].includes(index)) {
                                var input = $('<input>').val(currentValue).css({ width: '100%' });
                                cell.empty().append(input);
                            }
                            else if (index === 3) {
                                cell.empty().append(createRaceSelect(currentValue));
                            } else if (index === 4) {
                                cell.empty().append(createProfessionSelect(currentValue));
                            } else if (index === 5 || index === 6) {
                                cell.empty().text(currentValue);
                            } else if (index === 7) {
                                var select = $('<select>').css({ width: '100%' });
                                select.append('<option value="true" ' + (currentValue === 'true' ? 'selected' : '') + '>true</option>');
                                select.append('<option value="false" ' + (currentValue === 'false' ? 'selected' : '') + '>false</option>');
                                cell.empty().append(select);
                            }
                        });
                    } else {
                        var playerId = player.id;
                        var updatedData = {
                            name: row.find('td').eq(1).find('input').val(),
                            title: row.find('td').eq(2).find('input').val(),
                            race: row.find('td').eq(3).find('select').val(),
                            profession: row.find('td').eq(4).find('select').val(),
                            banned: row.find('td').eq(7).find('select').val() === 'true'
                        };
                        $.ajax({
                            url: "/rest/players/" + playerId,
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(updatedData),
                            success: function() {
                                $(this).attr('src', '../img/edit.png').attr('alt', 'Edit');
                                sendRequest(currentPage);
                            }.bind(this),
                            error: function(errors) {
                                console.error("Ошибка сети: " + errors.status);
                            }
                        });
                    }
                });


            row.append($('<td></td>').append(editImage));
            row.append($('<td></td>').append(deleteImage));
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
                const selectRaceInForm = document.getElementById('raceSelect');
                populateRaceSelect(selectRaceInForm);
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