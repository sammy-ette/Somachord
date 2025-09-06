import gleam/dynamic
import gleam/dynamic/decode
import gleam/javascript/array
import lustre/attribute
import lustre/element/html
import lustre/event
import plinth/browser/element
import plinth/browser/window
import somachord/model

@external(javascript, "./components.ffi.mjs", "emit_click")
pub fn emit_click(target: dynamic.Dynamic) -> Nil

pub fn redirect_click(msg msg: a) {
  event.on(
    "click",
    decode.new_primitive_decoder("event", fn(event) {
      emit_click(event)

      Ok(msg)
    }),
  )
  |> event.prevent_default
}

pub fn layout() {
  case window.self() |> window.inner_width() < 800 {
    True -> model.Mobile
    False -> model.Desktop
  }
}

pub fn mobile_space() {
  html.div([attribute.class("h-28")], [])
}

@external(javascript, "./components.ffi.mjs", "get_element_by_id")
pub fn get_element_by_id(id: String) -> Result(element.Element, Nil)

@external(javascript, "./components.ffi.mjs", "scroll_into_view")
pub fn scroll_into_view(elem: element.Element) -> Nil

// converts arrays that arent actually arrays to arrays (plinth NodeList)
@external(javascript, "./components.ffi.mjs", "elems_to_array")
pub fn elems_to_array(elems: array.Array(a)) -> array.Array(b)
