import gleam/dict
import gleam/option
import somachord/models/auth
import somachord/storage
import varasto

import somachord/api_models
import somachord/queue
import somachord/router

pub type Player

pub type Model {
  Model(
    route: router.Route,
    success: option.Option(Bool),
    layout: Layout,
    storage: varasto.TypedStorage(storage.Storage),
    auth: auth.Auth,
    confirmed: Bool,
    albums: dict.Dict(String, api_models.Album),
    player: Player,
    queue: queue.Queue,
    current_song: api_models.Child,
    seeking: Bool,
    seek_amount: Int,
    played_seconds: Int,
    shuffled: Bool,
    looping: Bool,
    playlists: dict.Dict(String, api_models.Playlist),
    fullscreen_player_open: Bool,
    fullscreen_player_display: FullscreenPlayerDisplay,
  )
}

pub type PlayRequest {
  PlayRequest(type_: String, id: String, index: Int)
}

pub type PlaylistPlayRequest {
  PlaylistPlayRequest(playlist: api_models.Playlist, index: Int)
}

pub type Layout {
  Desktop
  Mobile
}

pub type Song {
  Song(id: String, title: String, album: String, artist: String, duration: Int)
}

pub type SongLyric {
  SongLyric(time: Int, line: String)
}

pub type FullscreenPlayerDisplay {
  Default
  Lyrics
}
