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
                            var inputIndexes = [1, 2]; // Индексы для Name и Title
                            if (inputIndexes.includes(index)) {
                                var input = $('<input>')
                                    .val(currentValue)
                                    .css({ width: '100%' });
                                cell.empty().append(input);
                            } else if (index === 3) {
                                var select = $('<select>').css({ width: '100%' });
                                var races = [];
                                $('table tbody tr').each(function() {
                                    var race = $(this).find('td').eq(3).text().trim();
                                    if (!races.includes(race)) {
                                        races.push(race);
                                    }
                                });
                                races.forEach(function(race) {
                                    select.append('<option value="' + race + '" ' + (currentValue === race ? 'selected' : '') + '>' + race + '</option>');
                                });
                                cell.empty().append(select);
                            } else if (index === 4) {
                                var select = $('<select>').css({ width: '100%' });
                                var professions = [];
                                $('table tbody tr').each(function() {
                                    var profession = $(this).find('td').eq(4).text().trim();
                                    if (!professions.includes(profession)) {
                                        professions.push(profession);
                                    }
                                });
                                professions.forEach(function(profession) {
                                    select.append('<option value="' + profession + '" ' + (currentValue === profession ? 'selected' : '') + '>' + profession + '</option>');
                                });
                                cell.empty().append(select);
                            } if (index === 5 || index === 6) {
                                cell.empty().text(currentValue);
                            } else if (index === 7) {
                                var select = $('<select>').css({ width: '100%' });
                                select.append('<option value="true" ' + (currentValue === 'true' ? 'selected' : '') + '>true</option>');
                                select.append('<option value="false" ' + (currentValue === 'false' ? 'selected' : '') + '>false</option>');
                                cell.empty().append(select);
                            }
                        });
                    } else {
                        // Сохраняем изменения
                        var playerId = player.id;
                        var updatedData = {
                            name: row.find('td').eq(1).find('input').val(), // Name
                            title: row.find('td').eq(2).find('input').val(), // Title
                            race: row.find('td').eq(3).find('select').val(), // Race
                            profession: row.find('td').eq(4).find('select').val(), // Profession
                            banned: row.find('td').eq(7).find('select').val() === 'true' // Banned
                        };
                        $.ajax({
                            url: "/rest/players/" + playerId,
                            type: "PUT",
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