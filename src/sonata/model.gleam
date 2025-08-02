import gleam/dynamic
import gleam/dynamic/decode
import gleam/option
import sonata/storage
import varasto

import sonata/router

pub type Model {
  Model(
    route: router.Route,
    layout: Layout,
    storage: varasto.TypedStorage(storage.Storage),
    confirmed: Bool,
  )
}

pub type Layout {
  Desktop
  Mobile
}

pub type Song {
  Song(id: String, title: String, album: String, artist: String, duration: Int)
}

pub type Album {
  Album(
    id: String,
    name: String,
    artist: String,
    artist_id: String,
    cover_art_id: String,
    duration: Int,
    plays: Int,
    created: String,
    year: Int,
    genres: List(String),
  )
}

pub fn album_decoder() {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use artist <- decode.field("artist", decode.string)
  use artist_id <- decode.field("artistId", decode.string)
  use cover_art_id <- decode.optional_field("coverArt", "", decode.string)
  use duration <- decode.field("duration", decode.int)
  use plays <- decode.field("playCount", decode.int)
  use created <- decode.field("created", decode.string)
  use year <- decode.field("year", decode.int)
  use genres <- decode.optional_field(
    "genres",
    [],
    decode.list({
      use genre <- decode.field("name", decode.string)
      decode.success(genre)
    }),
  )

  decode.success(Album(
    id:,
    name:,
    artist:,
    artist_id:,
    cover_art_id:,
    duration:,
    plays:,
    created:,
    year:,
    genres:,
  ))
}

pub type SongLyric {
  SongLyric(time: Int, line: String)
}
