import gleam/bool
import gleam/dict
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import plinth/javascript/date
import rsvp
import somachord/api_helper
import somachord/api_models
import somachord/models/auth
import somachord/msg
import somachord/queue

pub fn ping(auth_details: auth.Auth) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/ping.view",
    query: [],
    decoder: { decode.success(api_helper.Ping) },
    msg: msg.SubsonicResponse,
  )
}

pub fn album_list(
  auth_details auth_details: auth.Auth,
  type_ type_: String,
  offset offset: Int,
  amount amount: Int,
) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getAlbumList2.view",
    query: [
      #("offset", int.to_string(offset)),
      #("size", int.to_string(amount)),
      #("type", type_),
    ],
    decoder: {
      use albums <- decode.subfield(
        ["subsonic-response", "albumList2", "album"],
        decode.list(api_models.album_decoder()),
      )
      decode.success(api_helper.AlbumList(type_, albums))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn album(auth_details auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getAlbum.view",
    query: [#("id", id)],
    decoder: {
      use album <- decode.subfield(
        ["subsonic-response", "album"],
        api_models.album_decoder(),
      )
      decode.success(api_helper.Album(album))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn artist(auth_details auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getArtist.view",
    query: [#("id", id)],
    decoder: {
      use artist <- decode.subfield(
        ["subsonic-response", "artist"],
        api_models.artist_decoder(),
      )

      decode.success(api_helper.Artist(artist))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn song(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: fn(Result(api_helper.Response, rsvp.Error)) -> a,
) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getSong.view",
    query: [#("id", id)],
    decoder: {
      use song <- decode.subfield(
        ["subsonic-response", "song"],
        api_models.song_decoder(),
      )

      decode.success(api_helper.Song(song))
    },
    msg: msg,
  )
}

// gets most popular songs of an artist from last.fm
pub fn top_songs(
  auth_details auth_details: auth.Auth,
  artist_name artist_name: String,
) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getTopSongs.view",
    query: [#("artist", artist_name), #("count", "5")],
    decoder: {
      use songs <- decode.subfield(
        ["subsonic-response", "topSongs", "song"],
        decode.list(api_models.song_decoder()),
      )
      decode.success(api_helper.TopSongs(songs))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn scrobble(
  auth_details: auth.Auth,
  id id: String,
  submission submission: Bool,
) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/scrobble.view",
    query: [
      #("id", id),
      #("submission", bool.to_string(submission) |> string.lowercase),
    ],
    decoder: { decode.success(api_helper.Scrobble) },
    msg: msg.SubsonicResponse,
  )
}

pub fn like(auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/star.view",
    query: [#("id", id)],
    decoder: { decode.success(api_helper.Ping) },
    msg: msg.SubsonicResponse,
  )
}

pub fn unlike(auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/unstar.view",
    query: [#("id", id)],
    decoder: { decode.success(api_helper.Ping) },
    msg: msg.SubsonicResponse,
  )
}

pub fn search(auth_details: auth.Auth, query query: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/search3.view",
    query: [#("query", query)],
    decoder: {
      use artists <- decode.then(decode.optionally_at(
        ["subsonic-response", "searchResult3", "artist"],
        [],
        decode.list(api_models.artist_small_decoder()),
      ))

      use albums <- decode.then(decode.optionally_at(
        ["subsonic-response", "searchResult3", "album"],
        [],
        decode.list(api_models.album_decoder()),
      ))

      decode.success(
        api_helper.Search(
          artists,
          list.filter(albums, fn(album) { album.year != 0 }),
          [],
        ),
      )
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn similar_songs(auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getSimilarSongs.view",
    query: [#("id", id)],
    decoder: {
      use songs <- decode.subfield(
        ["subsonic-response", "similarSongs", "song"],
        decode.list(api_models.song_decoder()),
      )

      decode.success(api_helper.SimilarSongs(songs))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn similar_songs_artist(auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getSimilarSongs2.view",
    query: [#("id", id)],
    decoder: {
      use songs <- decode.subfield(
        ["subsonic-response", "similarSongs2", "song"],
        decode.list(api_models.song_decoder()),
      )

      decode.success(api_helper.SimilarSongs(songs))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn queue(auth_details: auth.Auth) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getPlayQueue.view",
    query: [],
    decoder: {
      use song_position <- decode.then(decode.optionally_at(
        ["subsonic-response", "playQueue", "position"],
        0,
        decode.int,
      ))
      // song position is in milliseconds
      let song_position = int.to_float(song_position) /. 1000.0

      use songs <- decode.subfield(
        ["subsonic-response", "playQueue", "entry"],
        decode.list(api_models.song_decoder()),
      )
      let songs_indexed = list.index_map(songs, fn(idx, song) { #(song, idx) })
      // current is the id of the child/song the queue is currently on
      use current <- decode.subfield(
        ["subsonic-response", "playQueue", "current"],
        decode.string,
      )
      let assert Ok(current_song) =
        list.find(songs_indexed, fn(song) { { song.1 }.id == current })

      use changed <- decode.subfield(
        ["subsonic-response", "playQueue", "changed"],
        date_decoder(),
      )

      decode.success(api_helper.Queue(
        queue.Queue(
          ..queue.new(song_position:, songs: songs, position: current_song.0),
          changed:,
        ),
      ))
    },
    msg: msg.SubsonicResponse,
  )
}

fn date_decoder() {
  decode.new_primitive_decoder("Date", fn(v) {
    use timestamp <- result.try(
      decode.run(v, decode.string)
      |> result.map_error(fn(_) { date.new("May 19 2024") }),
    )
    Ok(date.new(timestamp))
  })
}

// saves the queue. gets cleared if queue is option.None
pub fn save_queue(auth_details: auth.Auth, queue: option.Option(queue.Queue)) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/savePlayQueue.view",
    query: case queue {
      option.Some(queue) -> {
        let assert Ok(current_song) = queue.songs |> dict.get(queue.position)
        [
          #("current", current_song.id),
          #(
            "position",
            queue.song_position *. 1000.0 |> float.truncate |> int.to_string,
          ),
          ..list.map(queue.list(queue), fn(song: #(Int, api_models.Child)) {
            #("id", { song.1 }.id)
          })
        ]
      }
      option.None -> []
    },
    decoder: decode.success(api_helper.Ping),
    msg: msg.SubsonicResponse,
  )
}

pub fn lyrics(auth_details: auth.Auth, id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getLyricsBySongId.view",
    query: [#("id", id)],
    decoder: {
      use lyrics <- decode.subfield(
        ["subsonic-response", "lyricsList", "structuredLyrics"],
        decode.list(api_models.lyric_set_decoder()),
      )

      decode.success(api_helper.Lyrics(lyrics))
    },
    msg: msg.SubsonicResponse,
  )
}
