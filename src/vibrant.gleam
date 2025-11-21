import gleam/javascript/promise
import lustre/effect
import somachord/model
import somachord/msg

pub type Swatch

@external(javascript, "./vibrant.ffi.mjs", "palette")
fn palette_js(_image_url: String) -> promise.Promise(model.Palette)

pub fn palette(
  image_url: String,
  on_palette on_palette: fn(Result(model.Palette, Nil)) -> msg.Msg,
) {
  use dispatch <- effect.from

  let _ =
    promise.await(palette_js(image_url), fn(res) {
      promise.resolve(dispatch(on_palette(Ok(res))))
    })

  Nil
}

@external(javascript, "./vibrant.ffi.mjs", "vibrant")
pub fn vibrant(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "dark_vibrant")
pub fn dark_vibrant(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "light_vibrant")
pub fn light_vibrant(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "muted")
pub fn muted(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "dark_muted")
pub fn dark_muted(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "light_muted")
pub fn light_muted(palette: model.Palette) -> Swatch

@external(javascript, "./vibrant.ffi.mjs", "swatch_hex")
pub fn hex(swatch: Swatch) -> String
