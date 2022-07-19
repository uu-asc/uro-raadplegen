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
    for (key in vak_data) {
        let item = vak_data[key]
        if (key.includes(searchCode) && item.includes(searchName)) {
            rows.push(
                `<tr><td><button data-click>copy</button></td>
                <td>${key}</td>
                <td>${vak_data[key]}</td></tr>`
            );
            result.innerHTML = `<table>${rows.join('')}</table>`
        };
    };
};

document.addEventListener('click', function (event) {
    if (event.target.dataset.click != undefined) {
        let value;
        value = event.target.parentElement.nextElementSibling.innerHTML;

        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = value;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        console.log(value)
    };
});
