// Constants and Element Selectors
const ELEMENTS = {
    dataViewer: document.querySelector("flatbread-table"),
    studyPeriodSelector: document.querySelector("study-period-selector"),
    flexInput: document.querySelector("#aantal-ec-flex"),
    flexOutput: document.querySelector("#te-betalen-bedrag-flex"),
    collegeYearSelector: document.getElementById("collegejaar"),
    messageBoard: document.querySelector("#messageboard"),
    form: {
        currency: document.querySelector("[name='as-currency']"),
        thousands: document.querySelector("[name='sep-thousands']"),
        localeInputs: document.querySelectorAll("input[name='locale']")
    }
}

// State Management
class StateManager {
    constructor() {
        this.data = null
        this.originalValues = null
    }

    async loadFromSource(src) {
        try {
            const response = await fetch(src)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()

            // Store original values for recalculation
            this.originalValues = data.values
            this.data = data

            return this.data
        } catch (error) {
            console.error("Failed to fetch data:", error)
            this.showErrorMessage("Failed to load data")
        }
    }

    getFormatOptions() {
        const { currency, thousands } = ELEMENTS.form
        return {
            style: currency.checked ? "currency" : "decimal",
            currency: "EUR",
            useGrouping: thousands.checked,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            trailingZeroDisplay: !currency.checked ? "stripIfInteger" : "auto"
        }
    }

    updateFormatting() {
        const formatOptions = this.getFormatOptions()
        this.data.formatOptions = [formatOptions, formatOptions]
        return this.data
    }

    calculateValues(n = 12) {
        if (!this.originalValues) return null

        const calculateFee = value => value ? (value / 12) * n : null
        return this.originalValues.map(row => row.map(calculateFee))
    }
}

// Form State Management
class FormStateManager {
    static STORAGE_KEY = "getalsnotatie-state"

    static save() {
        const { currency, thousands } = ELEMENTS.form
        const locale = document.querySelector("input[name='locale']:checked")
        if (!locale) return

        const state = {
            currency: currency.checked,
            thousands: thousands.checked,
            locale: locale.value
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state))
    }

    static load() {
        const saved = localStorage.getItem(this.STORAGE_KEY)
        if (!saved) return

        try {
            const state = JSON.parse(saved)
            const { currency, thousands } = ELEMENTS.form

            if (currency) currency.checked = state.currency
            if (thousands) thousands.checked = state.thousands

            const localeInput = document.querySelector(`input[name="locale"][value="${state.locale}"]`)
            if (localeInput) localeInput.checked = true

            return true
        } catch (error) {
            console.error("Error loading form state:", error)
            return false
        }
    }
}

// UI Updates
class UIManager {
    constructor(stateManager) {
        this.stateManager = stateManager
    }

    getLocale() {
        return document.querySelector("input[name='locale']:checked")?.value
    }

    getCurrentPeriod() {
        return ELEMENTS.studyPeriodSelector.n || 12
    }

    updateTable(n) {
        const newValues = this.stateManager.calculateValues(n)
        if (!newValues) return

        ELEMENTS.dataViewer.data.values = newValues
        ELEMENTS.dataViewer.data.formatOptions = [
            this.stateManager.getFormatOptions(),
            this.stateManager.getFormatOptions()
        ]
    }

    updateFlexFee() {
        const { flexInput, flexOutput } = ELEMENTS
        if (!flexInput.value || !this.stateManager.originalValues) {
            flexOutput.innerText = ""
            return
        }

        const fee = (
            flexInput.value *
            (this.stateManager.originalValues[1][0] / 60) *
            1.15
        ).toLocaleString(this.getLocale(), this.stateManager.getFormatOptions())

        flexOutput.innerText = fee
    }

    copyToClipboard(content) {
        navigator.clipboard.writeText(content)
        .then(() => {
            ELEMENTS.messageBoard.innerHTML = `<span class="heart">♥</span> klembord: <span class="klembord">${content}</span> <span class="heart">♥</span>`
            setTimeout(() => ELEMENTS.messageBoard.innerHTML = "", 1200)
        })
    }
}

// Application
class App {
    constructor() {
        this.stateManager = new StateManager()
        this.uiManager = new UIManager(this.stateManager)
    }

    getSourcePath() {
        return `../data/collegegeld/bedragen_${ELEMENTS.collegeYearSelector.value}.json`
    }

    async init() {
        FormStateManager.load()
        this.setupEventListeners()
        await this.setSources()
    }

    async setSources() {
        const source = this.getSourcePath()
        const locale = this.uiManager.getLocale()
        if (locale) {
            ELEMENTS.dataViewer.setAttribute("locale", locale)
        }

        await this.stateManager.loadFromSource(source)

        // Set the initial data
        ELEMENTS.dataViewer.data = this.stateManager.data

        // Then update formatting and values
        this.stateManager.updateFormatting()
        const currentPeriod = this.uiManager.getCurrentPeriod()
        this.uiManager.updateTable(currentPeriod)
        this.uiManager.updateFlexFee()
    }

    setupEventListeners() {
        // College Year Change
        ELEMENTS.collegeYearSelector.addEventListener("change", () => this.setSources())

        // Data Viewer Cell Click
        ELEMENTS.dataViewer.addEventListener("cell-click", event => {
            this.uiManager.copyToClipboard(event.detail.value)
        })

        // Study Period Change
        ELEMENTS.studyPeriodSelector.addEventListener("period-change", event => {
            this.uiManager.updateTable(event.detail.n)
        })

        // Locale Change
        ELEMENTS.form.localeInputs.forEach(radio => {
            radio.addEventListener("change", () => {
                const locale = this.uiManager.getLocale()
                ELEMENTS.dataViewer.setAttribute("locale", locale)
                ELEMENTS.studyPeriodSelector.setAttribute("language", locale.substr(0, 2))
                this.stateManager.updateFormatting()
                this.uiManager.updateTable(this.uiManager.getCurrentPeriod())
            })
        })

        // Form Changes
        document.addEventListener("change", event => {
            if (event.target.closest("fieldset")?.classList.contains("getalsnotatie")) {
                this.uiManager.updateTable(this.uiManager.getCurrentPeriod())
                this.uiManager.updateFlexFee()
                FormStateManager.save()
            }
            if (event.target.matches("#aantal-ec-flex")) {
                this.uiManager.updateFlexFee()
            }
        })

        // Flex Input Updates
        document.addEventListener("keyup", event => {
            if (event.target.matches("#aantal-ec-flex")) {
                this.uiManager.updateFlexFee()
            }
        })
    }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    const app = new App()
    app.init()
})
