import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/option
import gleam/string
import rsvp
import sonata/api_helper
import sonata/model
import sonata/models/auth
import sonata/msg

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
        decode.list(model.album_decoder()),
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
        model.album_decoder(),
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
        model.artist_decoder(),
      )

      decode.success(api_helper.Artist(artist))
    },
    msg: msg.SubsonicResponse,
  )
}

pub fn song(auth_details auth_details: auth.Auth, id id: String) {
  api_helper.construct_req(
    auth_details:,
    path: "/rest/getSong.view",
    query: [#("id", id)],
    decoder: {
      use song <- decode.subfield(
        ["subsonic-response", "song"],
        model.song_decoder(),
      )

      decode.success(api_helper.Song(song))
    },
    msg: msg.SongResponse,
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
        decode.list(model.song_decoder()),
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
