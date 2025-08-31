import gleam/dynamic/decode
import gleam/int
import gleam/option

pub type Artist {
  Artist(
    id: String,
    name: String,
    cover_art_id: String,
    albums: option.Option(List(Album)),
  )
}

pub type SmallArtist {
  SmallArtist(id: String, name: String)
}

pub fn artist_decoder() {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use cover_art_id <- decode.optional_field("coverArt", "", decode.string)
  use albums <- decode.optional_field(
    "album",
    option.None,
    decode.then(decode.list(album_decoder()), fn(a) {
      decode.success(option.Some(a))
    }),
  )

  decode.success(Artist(id:, name:, cover_art_id:, albums:))
}

pub fn artist_small_decoder() {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)

  decode.success(SmallArtist(id:, name:))
}

pub type Album {
  Album(
    id: String,
    name: String,
    artists: List(SmallArtist),
    cover_art_id: String,
    duration: Int,
    plays: Int,
    created: String,
    year: Int,
    genres: List(String),
    songs: List(Child),
  )
}

pub fn album_decoder() {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use artists <- decode.field("artists", decode.list(artist_small_decoder()))
  use cover_art_id <- decode.optional_field("coverArt", "", decode.string)
  use duration <- decode.field("duration", decode.int)
  use plays <- decode.field("playCount", decode.int)
  use created <- decode.field("created", decode.string)
  use year <- decode.optional_field("year", 0, decode.int)
  use genres <- decode.optional_field(
    "genres",
    [],
    decode.list({
      use genre <- decode.field("name", decode.string)
      decode.success(genre)
    }),
  )
  use songs <- decode.optional_field("song", [], decode.list(song_decoder()))

  decode.success(Album(
    id:,
    name:,
    artists:,
    cover_art_id:,
    duration:,
    plays:,
    created:,
    year:,
    genres:,
    songs:,
  ))
}

pub type Child {
  Child(
    id: String,
    album_name: String,
    album_id: String,
    cover_art_id: String,
    artists: List(SmallArtist),
    duration: Int,
    title: String,
    track: Int,
    year: Int,
    starred: Bool,
    plays: Int,
  )
}

pub fn new_song() {
  Child(
    id: "",
    album_name: "",
    album_id: "",
    cover_art_id: "",
    artists: [],
    duration: 0,
    title: "",
    track: 0,
    year: 0,
    starred: False,
    plays: 0,
  )
}

pub fn song_decoder() {
  use id <- decode.field("id", decode.string)
  use album_name <- decode.field("album", decode.string)
  use album_id <- decode.then(
    decode.one_of(decode.at(["albumID"], decode.string), [
      decode.at(["parent"], decode.string),
    ]),
  )
  use cover_art_id <- decode.optional_field("coverArt", "", decode.string)
  use artists <- decode.field("artists", decode.list(artist_small_decoder()))
  use duration <- decode.field("duration", decode.int)
  use title <- decode.field("title", decode.string)
  use track <- decode.field("track", decode.int)
  use year <- decode.field("year", decode.int)
  use starred <- decode.optional_field("starred", False, decode.success(True))
  use plays <- decode.optional_field("playCount", 0, decode.int)

  decode.success(Child(
    id:,
    album_name:,
    album_id:,
    cover_art_id:,
    artists:,
    duration:,
    title:,
    track:,
    year:,
    starred:,
    plays:,
  ))
}

pub type LyricSet {
  LyricSet(synced: Bool, lang: String, offset: Float, lines: List(Lyric))
}

pub fn lyric_set_decoder() -> decode.Decoder(LyricSet) {
  use synced <- decode.field("synced", decode.bool)
  use lang <- decode.field("lang", decode.string)
  use offset_ms <- decode.optional_field("offset", 0, decode.int)
  let offset = case offset_ms {
    0 -> 0.0
    _ -> int.to_float(offset_ms) /. 1000.0
  }
  use lines <- decode.field("line", decode.list(lyric_decoder()))
  decode.success(LyricSet(synced:, lang:, offset:, lines:))
}

pub type Lyric {
  Lyric(time: Float, text: String)
}

fn lyric_decoder() -> decode.Decoder(Lyric) {
  use time_ms <- decode.field("start", decode.int)
  let time = int.to_float(time_ms) /. 1000.0
  use text <- decode.field("value", decode.string)
  decode.success(Lyric(time:, text:))
}
