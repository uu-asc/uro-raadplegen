console.log("i have been summoned")

const inputCode = document.getElementById('zoek_code')
const inputNaam = document.getElementById('zoek_naam')
const inputPlaats = document.getElementById('zoek_plaats')
const result = document.getElementById('result')
const info = document.getElementById('info')

document.addEventListener('click', function (event) {
    let element = event.target;
    let isCopyable = element.classList.contains('copyable');
    if (isCopyable) {
        copyText(element, event.shiftKey)
    }
})

function copyText(element) {
    let to_copy = element.innerText
    navigator
        .clipboard.writeText(to_copy)
        .then(res => { console.log("gekopieerd naar klembord") })
}

let data
fetch("../data/school.json")
    .then(response => response.json())
    .then(json => data = json)

// SEARCH RECORDS
inputCode.addEventListener('keyup', filterRecords)
inputNaam.addEventListener('keyup', filterRecords)
inputPlaats.addEventListener('keyup', filterRecords)

function filterRecords() {
    let code = inputCode.value.toUpperCase()
    let naam = inputNaam.value.toUpperCase()
    let plaats = inputPlaats.value.toUpperCase()
    let rows = []
    for (let record of data) {
        if (
            // record[0].includes(code)
            record[1].includes(naam)
            && record[2].includes(plaats)
        ) {
            rows.push(
                `<tr>
                    <td class="copyable">${record[0]}</td>
                    <td class="copyable">${record[1]}</td>
                    <td class="copyable">${record[2]}</td>
                </tr>`
            )
            result.innerHTML = `<table>${rows.join('')}</table>`
        }
    }
}
