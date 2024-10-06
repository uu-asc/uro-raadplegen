const simpleTable = document.querySelector("simple-table")
const studyPeriodSelector = document.querySelector("study-period-selector")
const flexinput = document.querySelector(`#aantal-ec-flex`)
const flexoutput = document.querySelector(`#te-betalen-bedrag-flex`)

let STATE
let FORMAT_OPTIONS = getFormatOptions()
let LOCALE = getLocale()

document.getElementById("collegejaar").addEventListener("change", event => {
    const newSrc = `../data/collegegeld/bedragen_${event.target.value}.json`
    simpleTable.setAttribute("src" , newSrc)
})

simpleTable.addEventListener("data-loaded", () => {
    STATE = simpleTable.getValues()
    updateFlexFee()
})

simpleTable.addEventListener("cell-click", event => {
    const content = event.detail.value

    navigator
    .clipboard.writeText(content)
    .then(res => {
        messageboard.innerHTML = `<span class="heart">&hearts;</span> klembord: <span class="klembord">${content}</span> <span class="heart">&hearts;</span>`
        setTimeout(() => messageboard.innerHTML = "", 1200)
    })
})

studyPeriodSelector.addEventListener("period-change", event => {
    updateTable(event.detail.n)
})

function getFormatOptions() {
    const checkboxAsCurrency = document.querySelector(`[name="as-currency"]`)
    const checkboxSepThousands = document.querySelector('input[name="sep-thousands"]')
    const formatOptions = {
        "style": checkboxAsCurrency.checked ? "currency" : "decimal",
        "currency": "EUR",
        "useGrouping": checkboxSepThousands.checked,
        "minimumFractionDigits": 2,
        "maximumFractionDigits": 2,
        "trailingZeroDisplay": !checkboxAsCurrency.checked ? "stripIfInteger" : "auto",
    }
    return formatOptions
}

function getLocale() {
    return document.querySelector('input[type="radio"]:checked')?.value
}

function updateTable(n) {
    const calculateFee = value => value ? (value / 12) * n : null
    const newValues = STATE.map(row => row.map(calculateFee))
    simpleTable.updateValues(newValues)
}

document.querySelectorAll('input[name="locale"]').forEach(radio => {
    radio.addEventListener("change", () => {
        LOCALE = getLocale()
        simpleTable.setAttribute("locale", LOCALE)
        studyPeriodSelector.setAttribute("language", LOCALE.substr(0, 2))
    })
})

function handleFormattingChange() {
    FORMAT_OPTIONS = getFormatOptions()
    simpleTable.setFormatOptions([FORMAT_OPTIONS, FORMAT_OPTIONS])
}

document.getElementById("as-currency").addEventListener("change", handleFormattingChange)
document.getElementById("sep-thousands").addEventListener("change", handleFormattingChange)

function calcFlexFee(ec) {
    return (ec * (STATE[1][0] / 60) * 1.15).toLocaleString(LOCALE, FORMAT_OPTIONS)
}

function updateFlexFee() {
    if ( flexinput.value ) {
        flexoutput.innerText = calcFlexFee(flexinput.value)
    } else { flexoutput.innerText = "" } return
}

document.addEventListener("change", event => {
    if ( event.target.closest("fieldset")?.classList.contains("getalsnotatie") ) {
        updateTable(studyPeriodSelector.n)
        updateFlexFee()
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
