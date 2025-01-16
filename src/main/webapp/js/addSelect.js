const select = document.getElementById('countPerPage');
for (let i = 3; i <= 20; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
}

