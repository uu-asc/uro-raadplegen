console.log("i have been summoned")

const inputs = document.querySelectorAll("input")
const wisfilters = document.querySelector("#wisfilters")
const nresults = document.querySelector("#nresults")

// SEARCH RECORDS
inputs.forEach( el => el.addEventListener("keyup", filterRecords) )
wisfilters.addEventListener("click", e => {
    inputs.forEach( el => el.value = "" )
    filterRecords()
})

function filterRecords() {
    let values = []
    inputs.forEach( el => values.push(el.value.toUpperCase()) )
    let rows = []
    for (let record of data) {
        if (
            record.every( (item, idx) => item.toUpperCase().includes(values[idx] ? values[idx] : "") )
        ) {
            let row = record.map((item, idx) => `<td class="copyable ${idx === 0 ? "monospace" : ""}">${item}</td>`).join("")
            rows.push(`<tr>${row}</tr>`)
        }
    }
    nresults.innerHTML = `n_resultaten <span class="monospace">${rows.length} / ${data.length}</span>`
    let header = headernames.map(item => `<th>${item}</th>`).join("")
    result.innerHTML = `<table>
        <thead><tr>${header}</tr></thead>
        <tbody>${rows.join("")}</tbody>
    </table>`
}
