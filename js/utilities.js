const messageboard = document.querySelector("#messageboard")

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return
    }

    switch (event.key) {
        case "Escape":
            if (event.shiftKey) {
                document
                    .querySelectorAll("input.query-input")
                    .forEach(el => el.value = "")
            } else {
                event.target.value = ""
            }
            break
        default:
            return // Quit when this doesn't handle the key event.
    }

    // cancel the default action to avoid it being handled twice
    event.preventDefault()
    // send key up event to trigger rerender
    let inputs = document.querySelector("input.query-input")
    if (inputs) {
        inputs.dispatchEvent(new Event("keyup", {bubbles: true}))
    }
})

document.addEventListener("click", function (event) {
    if (event.target.matches("input.query-input") && event.target.value) {
        event.target.value = ""
        let keyupEvent = new Event("keyup", {bubbles: true})
        event.target.dispatchEvent(keyupEvent)
    }
})

document.addEventListener("click", function (event) {
    let element = event.target
    if (element.matches(".copyable")) { copyText(element) }
})

function copyText(element) {
    let content = element.innerText
    if (element.tagName === "TEXTAREA") {
        content = element.value
    }
    navigator
        .clipboard.writeText(content)
        .then(res => {
            messageboard.innerHTML = `<span class="heart">&hearts;</span> klembord: <span class="klembord">${content}</span> <span class="heart">&hearts;</span>`
            setTimeout(() => messageboard.innerHTML = "", 1200)
        })
}

function copyTextFromElementWithId(id) {
    let element = document.getElementById(id)
    copyText(element)
}
