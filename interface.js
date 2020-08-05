console.log("i have been summoned")

const search = document.getElementById('search');
const result = document.getElementById('result');
const info   = document.getElementById('info');

// let toelating;
// fetch("data/toelating/duib.html")
//     .then(response => response.text())
//     .then(text => {console.log(text); toelating = text);


let uro_data;
fetch("https://raw.githubusercontent.com/uu-asc/uro_raadplegen/master/data/data.json")
    .then(response => response.json())
    .then(json => uro_data = json);

// SEARCH RECORDS
search.addEventListener('keyup', filterRecords);
function filterRecords() {
    let filter = search.value.toUpperCase();
    if (uro_data.hasOwnProperty(filter)) {
        let record = uro_data[filter]
        result.innerHTML = `
            <div class="container">
                <div class="box">
                    <h2>opleiding</h2>
                    <div class="fields">
                        <div class="field">opleiding</div>
                        <div class="value">${filter}</div>
                        <div class="field">opleiding_naam</div>
                        <div class="value">${record['opleiding_naam']}</div>
                        <div class="field">type_opleiding</div>
                        <div class="value">${record['type_opleiding']}</div>
                    </div>
                </div>
                <div class="box">
                    <h2>croho</h2>
                    <div class="fields">
                        <div class="field">croho</div>
                        <div class="value">${record['croho']}</div>
                        <div class="field">croho_naam</div>
                        <div class="value">${record['croho_naam']}</div>
                        <div class="field">croho_sector</div>
                        <div class="value">${record['croho_sector']}</div>
                        <div class="field">nominale_studieduur</div>
                        <div class="value">${record['nominale_studieduur']}</div>
                        <div class="field">bekostigings_niveau</div>
                        <div class="value">${record['bekostigings_niveau']}</div>
                    </div>
                </div>
                <div class="box">
                    <h2>onderdeel</h2>
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
                <div class="box">
                    <h2>instroom</h2>
                    <div class="fields">
                        <div class="field">februari_instroom</div>
                        <div class="value">${record['februari_instroom']}</div>
                        <div class="field">inschrijven_tm</div>
                        <div class="value">${record['inschrijven_tm']}</div>
                        <div class="field">herinschrijven_tm</div>
                        <div class="value">${record['herinschrijven_tm']}</div>
                        <div class="field">inschrijven_vanaf</div>
                        <div class="value">${record['inschrijven_vanaf']}</div>
                    </div>
                </div>
                <div class="box">
                    <h2>toelating</h2>
                    <div class="fields">
                        <div class="field">NT</div>
                        <div class="value">${record['NT']}</div>
                        <div class="field">NG</div>
                        <div class="value">${record['NG']}</div>
                        <div class="field">EM</div>
                        <div class="value">${record['EM']}</div>
                        <div class="field">CM</div>
                        <div class="value">${record['CM']}</div>
                    </div>
                </div>
            </div>
            `;
        fetch(`https://raw.githubusercontent.com/uu-asc/uro_raadplegen/master/data/toelating/${filter}.html`)
            .then(response => response.text())
            .then(function (text) {
                info.innerHTML = text;
            });
    } else {
        result.innerHTML = ''
        info.innerHTML = ''
    };
};
