import { Ok, Error } from "../gleam.mjs"

export function emit_click(event) {
    document.dispatchEvent(new CustomEvent('component-click', {
        bubbles: true,
        cancelable: true,
        detail: {
            clickEvent: event
        }
    }))
}

export function get_element_by_id(id) {
    let elem = this.shadowRoot.getElementById(id)
    if (!elem) {
        return new Error()
    }

    return new Ok(elem)
}

export function scroll_into_view(element) {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
}

export function elems_to_array(nl) {
    return [...nl]
}
