document.addEventListener('DOMContentLoaded', function() {
    const selectCountPerPages = document.getElementById('countPerPage');
    for (let i = 4; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectCountPerPages.appendChild(option);
    }
    function populateRaceSelect(selectRaceInForm) {
        getPlayers().then(players => {
            const uniqueRaces = getUniqueRaces(players);
            uniqueRaces.forEach(race => {
                const option = document.createElement('option');
                option.value = race;
                option.textContent = race;
                selectRaceInForm.appendChild(option);
            });
        }).catch(error => {
            console.error('Ошибка получения рас:', error);
        });
    }


    const selectProfessionInForm = document.getElementById('professionSelect');

});



// Функция для получения данных о игроках из API
async function getPlayers(pageNumber = 1, pageSize = 100) {
    try {
        const response = await fetch(`/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        return [];
    }
}

function getUniqueRaces(players) {
    const races = new Set();
    players.forEach(player => {
        if (player.race) {
            races.add(player.race);
        } else {
            console.warn("Player does not have a race:", player);
        }
    });
    return Array.from(races);
}
function createRaceSelect(currentValue) {
    const selectRace = $('<select>').attr('id', 'raceSelect').css({ width: '100%' });
    getPlayers().then(players => {
        const uniqueRaces = getUniqueRaces(players);
        uniqueRaces.forEach(race => {
            const option = $('<option>').val(race).text(race);
            selectRace.append(option);
        });
        selectRace.val(currentValue || uniqueRaces[0] || '');
    });
    return selectRace;
}

function createProfessionSelect(currentValue) {
    const selectProfession = $('<select>').attr('id', 'professionSelect').css({ width: '100%' });
    getPlayers().then(players => {
        const uniqueProfessions = new Set(players.map(player => player.profession).filter(Boolean));
        uniqueProfessions.forEach(profession => {
            const option = $('<option>').val(profession).text(profession);
            selectProfession.append(option);
        });
        selectProfession.val(currentValue || '');
    });
    return selectProfession;
}
function populateRaceSelect(selectElement, currentValue) {
    getPlayers().then(players => {
        console.log('Игроки для заполнения рас:', players); // Отладочное сообщение
        const uniqueRaces = getUniqueRaces(players);
        uniqueRaces.forEach(race => {
            const option = document.createElement('option');
            option.value = race;
            option.textContent = race;
            selectElement.appendChild(option);
        });
        selectElement.value = currentValue || uniqueRaces[0] || ''; // Устанавливаем выбранное значение
    }).catch(error => {
        console.error('Ошибка получения рас:', error);
    });
}
function populateSelectElement(selectElement, options, currentValue) {
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue; // Устанавливаем значение
        option.textContent = optionValue; // Устанавливаем текст
        selectElement.appendChild(option);
    });
    selectElement.value = currentValue || options[0] || '';
}


