const dataViewer = document.querySelector("data-viewer")
const studyPeriodSelector = document.querySelector("study-period-selector")
const flexinput = document.querySelector(`#aantal-ec-flex`)
const flexoutput = document.querySelector(`#te-betalen-bedrag-flex`)

let STATE = loadSTATEFromSrc(getSource())
let FORMAT_OPTIONS = getFormatOptions()
let LOCALE = getLocale()

function getSource() {
    const selector = document.getElementById("collegejaar")
    return `../data/collegegeld/bedragen_${selector.value}.json`
}

async function loadSTATEFromSrc(src) {
    try {
        const response = await fetch(src)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        STATE = await response.json()
    } catch (error) {
        console.error("Failed to fetch data:", error)
        this.showErrorMessage("Failed to load data")
    }
}

async function setSources() {
    const source = getSource()
    dataViewer.setAttribute("src" , source)
    await loadSTATEFromSrc(source)
    updateFlexFee()
}

document.getElementById("collegejaar").addEventListener("change", setSources)

dataViewer.addEventListener("cell-click", event => {
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

async function updateTable(n) {
    const calculateFee = value => value ? (value / 12) * n : null
    await dataViewer.loadDataFromSrc(getSource())
    const newValues = dataViewer.data.values.map(row => row.map(calculateFee))
    dataViewer.data.values = newValues
}

document.querySelectorAll('input[name="locale"]').forEach(radio => {
    radio.addEventListener("change", () => {
        LOCALE = getLocale()
        dataViewer.setAttribute("locale", LOCALE)
        studyPeriodSelector.setAttribute("language", LOCALE.substr(0, 2))
    })
})

function handleFormattingChange() {
    FORMAT_OPTIONS = getFormatOptions()
    dataViewer.data.formatOptions = [FORMAT_OPTIONS, FORMAT_OPTIONS]
}

document.getElementById("as-currency").addEventListener("change", handleFormattingChange)
document.getElementById("sep-thousands").addEventListener("change", handleFormattingChange)

function calcFlexFee(ec) {
    return (ec * (STATE.values[1][0] / 60) * 1.15).toLocaleString(LOCALE, FORMAT_OPTIONS)
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
