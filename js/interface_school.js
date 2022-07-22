console.log("i have been summoned")

const inputCode = document.getElementById('zoek_code')
const inputNaam = document.getElementById('zoek_naam')
const inputPlaats = document.getElementById('zoek_plaats')
const result = document.getElementById('result')
const info = document.getElementById('info')

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
            record[1].toUpperCase().includes(naam)
            && record[2].toUpperCase().includes(plaats)
            && record[0].toUpperCase().includes(code)
        ) {
            rows.push(
                `<tr>
                    <td class="copyable monospace">${record[0]}</td>
                    <td class="copyable">${record[1]}</td>
                    <td class="copyable">${record[2]}</td>
                </tr>`
            )
        }
    }
    result.innerHTML = `<table>${rows.join('')}</table>`
}
