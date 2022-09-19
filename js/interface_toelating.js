console.log("i have been summoned")

let params = new URLSearchParams(window.location.search)
const search = document.getElementById("search");
const result = document.getElementById("result");
const info = document.getElementById("info");

let data
fetch("../data/toelating.json")
    .then(response => response.json())
    .then(json => data = json)
    .then(data => {
        if (params.get("opl")) {
            search.value = params.get("opl")
            search.dispatchEvent(new Event("keyup", {bubbles: true}))
        }
    })

// SEARCH RECORDS
search.addEventListener("keyup", filterRecords)
function filterRecords() {
    let filter = search.value.toUpperCase()
    if (data.hasOwnProperty(filter)) {
        let record = data[filter]
        result.innerHTML = `
            <a href="./toelating.html?opl=${filter}">&#128279; directe link naar deze pagina</a>
            <div class="container">
                <div class="box margins-off">
                    <h3>Opleiding</h3>
                    <div class="fields">
                        <div class="field">opleiding</div>
                        <div class="value copyable">${filter}</div>
                        <div class="field">opleiding_naam</div>
                        <div class="value copyable">${record['opleiding_naam_nl']}</div>
                        <div class="field">opleiding_naam_en</div>
                        <div class="value copyable">${record['opleiding_naam_en']}</div>
                        <div class="field">type_opleiding</div>
                        <div class="value copyable">${record['type_opleiding']}</div>
                        <div class="field">inschrijfvorm</div>
                        <div class="value copyable">${record['vtdt_vorm']}</div>
                    </div>
                </div>
                <div class="box margins-off">
                    <h3>CROHO</h3>
                    <div class="fields">
                        <div class="field">croho</div>
                        <div class="value copyable">${record['croho']}</div>
                        <div class="field">croho_naam</div>
                        <div class="value copyable">${record['croho_naam_nl']}</div>
                        <div class="field">croho_naam_en</div>
                        <div class="value copyable">${record['croho_naam_en']}</div>
                        <div class="field">croho_sector</div>
                        <div class="value copyable">${record['croho_sector']}</div>
                        <div class="field">nominale_studieduur</div>
                        <div class="value copyable">${record['nominale_studieduur']}</div>
                        <div class="field">bekostigings_niveau</div>
                        <div class="value copyable">${record['bekostigingsniveau']}</div>
                    </div>
                </div>
                <div class="box margins-off">
                    <h3>Toelating RATHO</h3>
                    <div class="fields">
                        <div class="field">NT</div>
                        <div class="value copyable">${record['NT']}</div>
                        <div class="field">NG</div>
                        <div class="value copyable">${record['NG']}</div>
                        <div class="field">EM</div>
                        <div class="value copyable">${record['EM']}</div>
                        <div class="field">CM</div>
                        <div class="value copyable">${record['CM']}</div>
                    </div>
                </div>
            </div>
            `
        fetch(`../data/toelating/${filter}.html`)
            .then(response => response.ok ? response.text() : "")
            .then(function (text) { info.innerHTML = text })
    } else {
        result.innerHTML = ''
        info.innerHTML = ''
    }
}
