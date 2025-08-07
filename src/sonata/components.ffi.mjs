export function emit_click(event) {
    document.dispatchEvent(new CustomEvent('component-click', {
        bubbles: true,
        cancelable: true,
        detail: {
            clickEvent: event
        }
    }))
}
