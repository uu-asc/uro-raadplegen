const messageboard = document.querySelector("#messageboard")

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return
    }

    switch (event.key) {
        case "Escape":
            if (event.shiftKey) {
                document
                    .querySelectorAll("input")
                    .forEach(el => el.value = "")
            } else {
                event.target.value = ""
            }
            break
        default:
            return // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault()
})

document.addEventListener("click", function (event) {
    if (event.target.matches("input") && event.target.value) {
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
            messageboard.innerHTML = `&hearts; klembord: <span>${content}</span> &hearts;`
            setTimeout(() => messageboard.innerHTML = "", 1200)
        })
}

function copyTextFromElementWithId(id) {
    let element = document.getElementById(id)
    copyText(element)
}
