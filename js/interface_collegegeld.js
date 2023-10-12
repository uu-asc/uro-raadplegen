let data = {
    "columns": [
        "BA",
        "MA"
    ],
    "index": [
        [
            "wettelijk",
            "Deeltijd"
        ],
        [
            "wettelijk",
            "Voltijd"
        ],
        [
            "kleinschalig",
            "UCR"
        ],
        [
            "kleinschalig",
            "PPE"
        ],
        [
            "kleinschalig",
            "UCU"
        ],
        [
            "niet-EER",
            "UCR"
        ],
        [
            "niet-EER",
            "LAAG"
        ],
        [
            "niet-EER",
            "PPE"
        ],
        [
            "niet-EER",
            "HOOG"
        ],
        [
            "niet-EER",
            "UCU"
        ],
        [
            "niet-EER",
            "TOP"
        ],
        [
            "graad",
            "LAAG"
        ],
        [
            "graad",
            "PPE"
        ],
        [
            "graad",
            "HOOG"
        ],
        [
            "graad",
            "UCU"
        ],
        [
            "graad",
            "TOP"
        ]
    ],
    "data": [
        [
            2056,
            2056
        ],
        [
            2314,
            2314
        ],
        [
            4135,
            null
        ],
        [
            4628,
            null
        ],
        [
            4802,
            null
        ],
        [
            9985,
            null
        ],
        [
            11523,
            18332
        ],
        [
            13723,
            null
        ],
        [
            14665,
            21736
        ],
        [
            14665,
            null
        ],
        [
            24408,
            27969
        ],
        [
            10365,
            12879
        ],
        [
            12637,
            null
        ],
        [
            12922,
            15045
        ],
        [
            12922,
            null
        ],
        [
            21160,
            24303
        ]
    ]
}

let maanden = {
    "01": {"nl-NL": "september", "en-US": "September"},
    "02": {"nl-NL": "oktober", "en-US": "October"},
    "03": {"nl-NL": "november", "en-US": "November"},
    "04": {"nl-NL": "december", "en-US": "December"},
    "05": {"nl-NL": "januari", "en-US": "January"},
    "06": {"nl-NL": "februari", "en-US": "February"},
    "07": {"nl-NL": "maart", "en-US": "March"},
    "08": {"nl-NL": "april", "en-US": "April"},
    "09": {"nl-NL": "mei", "en-US": "May"},
    "10": {"nl-NL": "juni", "en-US": "June"},
    "11": {"nl-NL": "juli", "en-US": "July"},
    "12": {"nl-NL": "augustus", "en-US": "August"},
}

let selectStartmaand = document.querySelector(`[name="startmaand"]`)
let selectStopmaand = document.querySelector(`[name="stopmaand"]`)
let labelStartmaand = document.querySelector(`#label-startmaand`)
let labelStopmaand = document.querySelector(`#label-stopmaand`)
let inputNMaanden = document.querySelector(`[name="nmaanden"]`)
let checkboxAsCurrency = document.querySelector(`[name="ascurrency"]`)
let radioLocaleNL = document.querySelector(`#locale-nl`)
let tabel = document.querySelector("table")
let flexinput = document.querySelector(`#aantal-ec-flex`)
let flexoutput = document.querySelector(`#te-betalen-bedrag-flex`)

function calcFlexFee(ec) {
    return formatNumber(ec * (2209 / 60) * 1.15)
}

function updateFlexFee() {
    if ( flexinput.value ) {
        flexoutput.innerText = calcFlexFee(flexinput.value)
    } else { flexoutput.innerText = "" }
    return
}

function updateLabelsMonths() {
    let locale = getLocale()
    let start = selectStartmaand.value
    let stop = selectStopmaand.value
    labelStartmaand.innerText = maanden[start][locale]
    labelStopmaand.innerText = maanden[stop][locale]
}

function getLocale() {
    return document.querySelector('input[name="locale"]:checked').value
}

function formatNumber(i) {
    let locale = getLocale()
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
    if ( event.target.matches(`[name$=maand]`) ) {
        updateInputsMaanden()
        updateLabelsMonths()
        return
    }
    if ( event.target.matches(`[name="nmaanden"]`) ) {
        updateTable(data.data)
        return
    }
    if ( event.target.closest("fieldset")?.classList.contains("getalsnotatie") ) {
        updateTable(data.data)
        updateFlexFee()
        updateLabelsMonths()
    }
    if ( event.target.matches(`#aantal-ec-flex`)) {
        updateFlexFee()
    }
})

document.addEventListener("keyup", event => {
    if ( event.target.matches(`#aantal-ec-flex`)) {
        updateFlexFee()
    }
})

document.addEventListener("click", event => {
    if ( event.target.matches(`#increment, #decrement`) ) {
        let n = event.target.id === "increment" ? 1 : -1
        let nmaand = incrementMaand(n)
        inputNMaanden.value = nmaand
        updateTable(data.data)
    }
})
