import gleam/option
import lustre
import lustre/effect
import somachord/api_models

pub type Model {
  Model(playlists: option.Option(List(api_models.Playlist)))
}

pub type Msg

pub fn register() {
  let app = lustre.component(init, update, view, [])
  lustre.register(app, "playlists-page")
}

pub fn init(_) {
  #(Model(playlists: option.None), effect.none())
}

pub fn update(m: Model, msg: Msg) {
  todo
}

pub fn view(m: Model) {
  todo
}
