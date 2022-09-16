let data = {"columns":["BA","MA"],"index":[["wettelijk","Deeltijd"],["wettelijk","Voltijd"],["kleinschalig","UCR"],["kleinschalig","PPE"],["kleinschalig","UCU"],["niet-EER","UCR"],["niet-EER","LAAG"],["niet-EER","PPE"],["niet-EER","HOOG"],["niet-EER","UCU"],["niet-EER","TOP"],["graad","LAAG"],["graad","PPE"],["graad","HOOG"],["graad","UCU"],["graad","TOP"]],"data":[[1963,1963],[2209,2209],[3750,null],[4418,null],[4584,null],[9450,null],[11000,17500],[13100,null],[14000,20750],[14000,null],[23300,26700],[9895,12295],[12063,null],[12336,14363],[12336,null],[20200,23200]]}

let selectStartmaand = document.querySelector(`[name="startmaand"]`)
let selectStopmaand = document.querySelector(`[name="stopmaand"]`)
let inputNMaanden = document.querySelector(`[name="nmaanden"]`)
let checkboxAsCurrency = document.querySelector(`[name="ascurrency"]`)
let radioLocaleNL = document.querySelector(`#locale-nl`)
let tabel = document.querySelector("table")

function formatNumber(i) {
    let locale = document.querySelector('input[name="locale"]:checked').value
    if ( i === 0 ) { return "" }
    if ( !checkboxAsCurrency.checked ) {
        let options = {
            "trailingZeroDisplay": "stripIfInteger",
            "useGrouping": document.querySelector('input[name="septhousands"]').checked,
            "minimumFractionDigits": 2,
            "maximumFractionDigits": 2,
        }
        return i.toLocaleString(locale, options)
    }
    let options = {
        "currency": "EUR",
        "style": "currency",
        "useGrouping": document.querySelector('input[name="septhousands"]').checked,
    }
    return i.toLocaleString(locale, options)
}

function updateTable(data) {
    let nmaanden = parseInt(inputNMaanden.value)
    Array.from(tabel.tBodies[0].rows).forEach((row, rowidx) => {
        let cells = row.querySelectorAll("td")
        cells.forEach((cell, colidx) => {
            let bedrag = ( data[rowidx][colidx] / 12 ) * nmaanden
            cell.innerText = formatNumber(bedrag)
        })
    })
}

function updateInputsMaanden() {
    Array.from(selectStopmaand.options).forEach(option => {
        if ( option.value < selectStartmaand.value ) {
            option.setAttribute("hidden", "")
        } else {
            option.removeAttribute("hidden", "")
        }
    })

    Array.from(selectStartmaand.options).forEach(option => {
        if ( option.value > selectStopmaand.value ) {
            option.setAttribute("hidden", "")
        } else {
            option.removeAttribute("hidden", "")
        }
    })

    let diff = parseInt(selectStopmaand.value) - parseInt(selectStartmaand.value) + 1
    inputNMaanden.value = diff
    updateTable(data.data)
}

function incrementMaand(n) {
    let val = parseInt(inputNMaanden.value) + n
    return val > 12 ? 12 : val < 1 ? 1 : val
}

document.addEventListener("change", event => {
    if ( event.target.matches(`[name$=maand]`) ) { updateInputsMaanden() }
    if ( event.target.matches(`[name="nmaanden"]`) ) { updateTable(data.data) }
    if ( event.target.closest("fieldset")?.classList.contains("getalsnotatie") ) { updateTable(data.data) }
})

document.addEventListener("click", event => {
    if ( event.target.matches(`#increment, #decrement`) ) {
        let n = event.target.id === "increment" ? 1 : -1
        let nmaand = incrementMaand(n)
        inputNMaanden.value = nmaand
        updateTable(data.data)
    }
})
