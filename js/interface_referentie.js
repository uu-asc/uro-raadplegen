console.log("i have been summoned")


let SORTING_STATE = null
let HIDDEN_COLUMNS_STATE = []
let PARAMS = new URLSearchParams(window.location.search)
for (let [key, value] of PARAMS) {
    el = document.getElementById(key)
    if (el) { el.value = value }
}

let data
fetch(datapath)
    .then(response => response.json())
    .then(json => data = json)
    .then(data => showRecords(data))


// INTERACTIVITY
document.addEventListener("keyup", function(event) {
    if (event.target.matches("input")) { showRecords(data) }
})

document.addEventListener("click", function(event) {
    if (event.target.matches("#wisfilters")) {
        document
            .querySelectorAll("input")
            .forEach( el => el.value = "" )
        showRecords(data)
    }
})


// HIDE FILTERS
document.addEventListener("change", function(event) {
    if (event.target.matches("[name^=label]")) {
        let label = event.target.name.split("-")[1]
        let targets = document.querySelectorAll(`[data-label="${label}"]`)
        if (event.target.checked) {
            targets.forEach(el => {
                el.classList.remove("hide")
                HIDDEN_COLUMNS_STATE = HIDDEN_COLUMNS_STATE.filter(i => i !== el.id)
            })
        } else {
            targets.forEach(el => {
                el.classList.add("hide")
                HIDDEN_COLUMNS_STATE.push(el.id)
            })
        }
        showRecords(data)
        return
    }
    if (event.target.matches("#toon-filters")) {
        if (event.target.checked) {
            document.querySelector(".searchbar__filters").classList.remove("hide")
        } else {
            document.querySelector(".searchbar__filters").classList.add("hide")
        }
        return
    }
})

document.addEventListener("click", function(event) {
    if (event.target.matches("[data-target]")) {
        let label = event.target.dataset.target
        document.querySelectorAll("[name^=label]").forEach(el => {
            if (el.id === label) { el.checked = true } else { el.checked = false }
            el.dispatchEvent(new Event("change", {bubbles: true}))
        })
        return
    }
    if (event.target.matches("#toon-alle-labels")) {
        document.querySelectorAll("[name^=label]").forEach(el => {
            el.checked = true
            el.dispatchEvent(new Event("change", {bubbles: true}))
        })
        return
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
    let used_cols = HIDDEN_COLUMNS_STATE.map(i => headernames.indexOf(i))
    let rows = []
    for (let record of view) {
        let row = record.map(
            (item, idx) => {
                return `<td class="copyable${idx === 0 ? " monospace" : ""} ${used_cols.includes(idx) ? " hide" : ""}">${item}</td>`
            }
        ).join("")
        rows.push(`<tr>${row}</tr>`)
    }
    renderattr = idx => idx === SORTING_STATE?.idx ? ` data-sort="${SORTING_STATE.sort}"` : ""
    let header = headernames.map(
        (item, idx) => {
            return `<th${used_cols.includes(idx) ? ' class="hide" ' : ""}${renderattr(idx)}>${item.replace(/_/g, " ")}</th>`
        }
    ).join("")
    return `<table>
        <thead><tr>${header}</tr></thead>
        <tbody>${rows.join("")}</tbody>
    </table>`
}

function renderNResults(view) {
    let params = {}
    document.querySelectorAll("input.query-input").forEach(
        el => {
            if (el.value) { params[el.id] = el.value }
        }
    )
    let urlparams = new URLSearchParams(params)
    let url = `${thisurl.split('/')[1]}?${urlparams.toString()}`
    return `n_resultaten <span class="monospace">${view.length} / ${data.length}</span><a href="${url}" class="direct-link">&#128279;</a>`
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
        .querySelectorAll("input.query-input")
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
