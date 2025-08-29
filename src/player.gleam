import lustre/effect

import somachord/model

@external(javascript, "./player_merulina.ffi.mjs", "new_")
pub fn new() -> model.Player

@external(javascript, "./player_merulina.ffi.mjs", "listen_events")
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

@external(javascript, "./player_merulina.ffi.mjs", "is_paused")
pub fn is_paused(player: model.Player) -> Bool

@external(javascript, "./player_merulina.ffi.mjs", "current")
pub fn current(player: model.Player) -> model.Child

@external(javascript, "./player_merulina.ffi.mjs", "pause_play")
pub fn toggle_play(player: model.Player) -> model.Child

@external(javascript, "./player_merulina.ffi.mjs", "seek")
pub fn seek(player: model.Player, amount: Int) -> Nil

// returns time in seconds
@external(javascript, "./player_merulina.ffi.mjs", "time")
pub fn time(player: model.Player) -> Float

@external(javascript, "./player_merulina.ffi.mjs", "load_song")
pub fn load_song(
  player: model.Player,
  link: String,
  info: model.Child,
  next: String,
  next_info: model.Child,
) -> Nil

@external(javascript, "./player_merulina.ffi.mjs", "beginning")
pub fn beginning(player: model.Player) -> Nil

@external(javascript, "./player_merulina.ffi.mjs", "loop")
pub fn loop(player: model.Player) -> Nil
