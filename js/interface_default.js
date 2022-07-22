console.log("i have been summoned")

const inputCode = document.getElementById('zoek_code')
const inputNaam = document.getElementById('zoek_naam')
const result = document.getElementById('result')

// SEARCH RECORDS
inputCode.addEventListener('keyup', filterRecords)
inputNaam.addEventListener('keyup', filterRecords)

function filterRecords() {
    let code = inputCode.value.toUpperCase()
    let naam = inputNaam.value.toUpperCase()
    let rows = []
    for (let record of data) {
        if (
            record[1].toUpperCase().includes(naam)
            && record[0].toUpperCase().includes(code)
        ) {
            let row = record.map((item, idx) => `<td class="copyable ${idx === 0 ? "monospace" : ""}">${item}</td>`).join("")
            rows.push(`<tr>${row}</tr>`)
        }
    }
    result.innerHTML = `<table>${rows.join("")}</table>`
}
