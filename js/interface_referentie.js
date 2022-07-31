console.log("i have been summoned")

let SORTING_STATE = null


// INTERACTIVITY
document.addEventListener("keyup", function (event) {
    if (event.target.matches("input")) { showRecords(data) }
})

document.addEventListener("click", function (event) {
    if (event.target.matches("#wisfilters")) {
        document
            .querySelectorAll("input")
            .forEach( el => el.value = "" )
        showRecords(data)
    }
})


// SHOW RECORDS
function showRecords(data) {
    let view = filterRecords(data)
    document.querySelector("#nresults").innerHTML = renderNResults(view)
    document.querySelector("#result").innerHTML = renderRecords(view)
}


// RENDER RECORDS
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


// FILTER RECORDS
function filterRecords(data) {
    let test = r => r.every( (item, idx) => {
        return item
            .toUpperCase()
            .includes(filters[idx] ? filters[idx] : "")
    })
    let filters = []
    document
        .querySelectorAll("input")
        .forEach( el => filters.push(el.value.toUpperCase()) )
    return data.filter(test)
}


// SORT RECORDS
document.addEventListener("click", function (event) {
    if (event.target.matches("th")) {
        let loc = event.target.cellIndex
        let previous = event.target.getAttribute("data-sort")
        SORTING_STATE = { idx: loc, sort: previous === "asc" ? "desc" : "asc" }
        document
            .querySelectorAll("th")
            .forEach( el => el.removeAttribute("data-sort") )
        sortOnColumn(data, loc, ascending=SORTING_STATE.sort==="asc")
        showRecords(data)
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
