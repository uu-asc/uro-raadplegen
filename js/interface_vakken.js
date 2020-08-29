console.log("i have been summoned")

const search = document.getElementById('search');
const result = document.getElementById('result');
const info   = document.getElementById('info');


let vak_data;
fetch("https://raw.githubusercontent.com/uu-asc/uro_raadplegen/master/data/data_vakken.json")
    .then(response => response.json())
    .then(json => vak_data = json);

// SEARCH RECORDS
search.addEventListener('keyup', filterRecords);
function filterRecords() {
    let filter = search.value.toUpperCase();
    for {i=0; i<vak_data.length, i++} {
        console.log{vak_data[i]}
    }
};

function toClipboard(id) {
    /* Get the text field */
    var copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
};
