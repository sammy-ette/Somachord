import gleam/dict
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
  )
}

pub type PlayRequest {
  PlayRequest(type_: String, id: String)
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
