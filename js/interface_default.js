console.log("i have been summoned")

let SORTING_STATE = null
const inputs = document.querySelectorAll("input")
const wisfilters = document.querySelector("#wisfilters")
const result = document.querySelector("#result")
const nresults = document.querySelector("#nresults")

// SEARCH RECORDS
inputs.forEach( el => el.addEventListener("keyup", showView) )
wisfilters.addEventListener("click", e => {
    inputs.forEach( el => el.value = "" )
    filterRecords()
})

function showView() {
    let view = filterRecords()
    nresults.innerHTML = renderNResults(view)
    result.innerHTML = renderRecords(view)
}

function filterRecords() {
    let test = r => r.every( (item, idx) => item.toUpperCase().includes(values[idx] ? values[idx] : "") )
    let values = []
    inputs.forEach( el => values.push(el.value.toUpperCase()) )
    return data.filter(test)
}

function renderRecords(view) {
    let rows = []
    for (let record of view) {
        let row = record.map(
            (item, idx) => `<td class="copyable ${idx === 0 ? "monospace" : ""}">${item}</td>`
        ).join("")
        rows.push(`<tr>${row}</tr>`)
    }
    renderattr = idx => idx === SORTING_STATE?.idx ? ` data-sort="${SORTING_STATE.sort}"` : ""
    let header = headernames.map(
        (item, idx) => `<th${renderattr(idx)}>${item}</th>`).join("")
    return `<table>
        <thead><tr>${header}</tr></thead>
        <tbody>${rows.join("")}</tbody>
    </table>`
}

function renderNResults(view) {
    return `n_resultaten <span class="monospace">${view.length} / ${data.length}</span>`
}

// SORT RECORDS
document.addEventListener("click", function (event) {
    if (event.target.matches("th")) {
        let loc = event.target.cellIndex
        let previous = event.target.getAttribute("data-sort")
        SORTING_STATE = { idx: loc, sort: previous === "asc" ? "desc" : "asc" }
        document.querySelectorAll("th").forEach(el => el.removeAttribute("data-sort"))
        sortOnColumn(data, loc, ascending=SORTING_STATE.sort==="asc")
        showView()
    }
})

function sortOnColumn(data, loc, ascending=true) {
    data.sort(function(a, b) {
        let nameA = a[loc].toUpperCase()
        let nameB = b[loc].toUpperCase()
        if (nameA < nameB) { return ascending ? -1: 1 }
        if (nameA > nameB) { return ascending ? 1 : -1 }
        return 0
    })
}
