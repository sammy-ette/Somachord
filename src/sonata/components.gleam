import gleam/dynamic
import gleam/dynamic/decode
import lustre/event

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
