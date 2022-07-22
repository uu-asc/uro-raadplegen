console.log("i have been summoned")

const inputCode = document.getElementById('search_code');
const inputName = document.getElementById('search_name');
const result = document.getElementById('result');
const info = document.getElementById('info');

let vak_data;
fetch("../data/vak.json")
    .then(response => response.json())
    .then(json => vak_data = json);

// SEARCH RECORDS
inputCode.addEventListener('keyup', filterRecords);
inputName.addEventListener('keyup', filterRecords);
function filterRecords() {
    let searchCode = inputCode.value.toUpperCase();
    let searchName = inputName.value.toUpperCase();
    let rows = []
    for (let key in vak_data) {
        let item = vak_data[key]
        if (key.includes(searchCode) && item.includes(searchName)) {
            rows.push(
                `<tr>
                <td class="copyable monospace">${key}</td>
                <td class="copyable">${vak_data[key]}</td></tr>`
            );
        };
    };
    result.innerHTML = `<table>${rows.join('')}</table>`
};
