import lustre/effect

import somachord/api_models
import somachord/model

@external(javascript, "./player.ffi.mjs", "new_")
pub fn new() -> model.Player

@external(javascript, "./player.ffi.mjs", "listen_events")
fn do_listen_events(
  player: model.Player,
  listener: fn(model.Player, String) -> Nil,
) -> Nil

pub fn listen_events(
  player: model.Player,
  listener: fn(String, model.Player) -> msg,
) -> effect.Effect(msg) {
  use dispatch <- effect.from
  do_listen_events(player, fn(plr, event) { event |> listener(plr) |> dispatch })
}

@external(javascript, "./player.ffi.mjs", "is_paused")
pub fn is_paused(player: model.Player) -> Bool

@external(javascript, "./player.ffi.mjs", "current")
pub fn current(player: model.Player) -> api_models.Child

@external(javascript, "./player.ffi.mjs", "pause_play")
pub fn toggle_play(player: model.Player) -> api_models.Child

@external(javascript, "./player.ffi.mjs", "seek")
pub fn seek(player: model.Player, amount: Int) -> Nil

// returns time in seconds
@external(javascript, "./player.ffi.mjs", "time")
pub fn time(player: model.Player) -> Float

@external(javascript, "./player.ffi.mjs", "load_song")
pub fn load_song(
  player: model.Player,
  link: String,
  info: api_models.Child,
) -> Nil

@external(javascript, "./player.ffi.mjs", "beginning")
pub fn beginning(player: model.Player) -> Nil
