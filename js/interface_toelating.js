console.log("i have been summoned")

const search = document.getElementById('search');
const result = document.getElementById('result');
const info = document.getElementById('info');

let data
fetch("../data/uro_details.json")
    .then(response => response.json())
    .then(json => data = json)

// SEARCH RECORDS
search.addEventListener('keyup', filterRecords);
function filterRecords() {
    let filter = search.value.toUpperCase();
    if (data.hasOwnProperty(filter)) {
        let record = data[filter]
        result.innerHTML = `
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

{/* <div class="box margins-off">
<div class="box margins-off">
    <h3>Onderdeel</h3>
    <div class="fields">
        <div class="field">faculteit</div>
        <div class="value">${record['faculteit']}</div>
        <div class="field">aggregaat_1</div>
        <div class="value">${record['aggregaat_1']}</div>
        <div class="field">aggregaat_2</div>
        <div class="value">${record['aggregaat_2']}</div>
        <div class="field">aggregaat_3</div>
        <div class="value">${record['aggregaat_3']}</div>
    </div>
</div>
<h3>Instroom</h3>
<div class="fields">
    <div class="field">februari_instroom</div>
    <div class="value">${record['februari_instroom']}</div>
    <div class="field">croho_inschrijven_vanaf</div>
    <div class="value">${record['croho_inschrijven_vanaf']}</div>
    <div class="field">croho_inschrijven_tm</div>
    <div class="value">${record['croho_inschrijven_tm']}</div>
    <div class="field">ext_inschrijven_vanaf</div>
    <div class="value">${record['ext_inschrijven_vanaf']}</div>
    <div class="field">ext_inschrijven_tm</div>
    <div class="value">${record['ext_inschrijven_tm']}</div>
</div>
</div>
<div class="box margins-off">
<h3>Herinschrijving</h3>
<div class="fields">
    <div class="field">croho_inschrijven_tm</div>
    <div class="value">${record['croho_herinschrijven_tm']}</div>
    <div class="field">ext_inschrijven_vanaf</div>
    <div class="value">${record['ext_herinschrijven_tm']}</div>
</div>
</div> */}
