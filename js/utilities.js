document.addEventListener("click", function (event) {
    if (event.target.matches("input")) {
        event.target.value = ""
    }
})

document.addEventListener("click", function (event) {
    let element = event.target
    if (element.matches(".copyable")) { copyText(element) }
})

function copyText(element) {
    navigator
        .clipboard.writeText(element.innerText)
        .then(res => { console.log("gekopieerd naar klembord") })
}
