const links = document.querySelector("#nuttige_links")
const input = document.querySelector("#zoekterm")
input.addEventListener("keyup", showView)

let data
fetch("../data/nuttige_links.json")
    .then(response => response.json())
    .then(json => data = json)
    .then(data => links.innerHTML = renderView(data))

function showView() {
    let view = filterRecords(data)
    links.innerHTML = renderView(view)
}

function renderView(view) {
    let items = []
    for (let [key, section] of Object.entries(view)) {
        let item = []
        item.push(`<h3>${key}</h3>`)
        for (let [key, links] of Object.entries(section)) {
            item.push(`<h4>${key}</h4>`)
            let list = []
            for (let link of links) {
                list.push(`<li><a href="${link.url}">${link.text}</a></li>`)
            }
            item.push(`<ul>${list.join("")}</ul>`)
        }
        items.push(`<div>${item.join("")}</div>`)
    }
    return items.join("")
}

function filterRecords(data) {
    let zoekterm = input.value.toUpperCase()
    let view = {}
    for (let [key1, section] of Object.entries(data)) {
        // kijk of zoekterm in kopje1 voorkomt
        if ( key1.toUpperCase().includes(zoekterm) ) {
            view[key1] = data[key1]
        } else {
            // kijk of zoekterm in kopje2 voorkomt
            for (let [key2, links] of Object.entries(section)) {
                if ( key2.toUpperCase().includes(zoekterm) ) {
                    view[key1] = view[key1] || {}
                    view[key1][key2] = data[key1][key2]
                } else {
                    // kijk of zoekterm in text of url voorkomt
                    let list = []
                    for (let link of links) {
                        let inLink = link.text.toUpperCase().includes(zoekterm)
                        let inUrl = link.url.toUpperCase().includes(zoekterm)
                        if ( inLink || inUrl ) {
                            list.push(link)
                        }
                    }
                    if ( list.length > 0 ) {
                        view[key1] = view[key1] || {}
                        view[key1][key2] = list
                    }
                }
            }
        }
    }
    return view
}
