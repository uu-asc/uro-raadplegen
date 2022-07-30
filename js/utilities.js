const messageboard = document.querySelector("#messageboard")

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return
    }

    switch (event.key) {
    case "Escape":
        event.target.value = ""
        // Do something for "esc" key press.
        break
    default:
        return // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault()
}, true)

document.addEventListener("click", function (event) {
    if (event.target.matches("input")) {
        event.target.value = ""
        let keyupEvent = new Event('keyup')
        event.target.dispatchEvent(keyupEvent)
    }
})

document.addEventListener("click", function (event) {
    let element = event.target
    if (element.matches(".copyable")) { copyText(element) }
})

function copyText(element) {
    let content = element.innerText
    navigator
        .clipboard.writeText(content)
        .then(res => {
            messageboard.innerHTML = `&hearts; klembord: <span>${content}</span> &hearts;`
            setTimeout(() => messageboard.innerHTML = '', 1200)
        })
}
