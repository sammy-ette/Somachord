import gleam/bool
import gleam/dict
import gleam/dynamic/decode
import gleam/float
import gleam/http/request
import gleam/int
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import gleam/uri
import plinth/javascript/date
import rsvp
import somachord/api/models as api_models
import somachord/models/auth
import somachord/queue
import somachord/router

pub type SubsonicError {
  WrongCredentials(message: String)
  NotFound
  SubsonicError(code: Int, message: String)
}

pub type EmptyResponse(a) =
  fn(Result(Result(Nil, SubsonicError), rsvp.Error)) -> a

pub type Response(a, b) =
  fn(Result(Result(a, SubsonicError), rsvp.Error)) -> b

pub type AlbumList {
  AlbumList(type_: String, albums: List(api_models.Album))
}

pub type Search {
  Search(List(api_models.SmallArtist), List(api_models.Album))
}

fn create_uri(
  auth_details: auth.Auth,
  path: String,
  query: List(#(String, String)),
) {
  let assert Ok(root) = auth_details.server_url |> uri.parse
  let assert Ok(original_uri) = uri.parse(router.direct(root, path))
  uri.Uri(
    ..original_uri,
    query: option.Some(
      uri.query_to_string([
        #("f", "json"),
        #("u", auth_details.username),
        #("s", auth_details.credentials.salt),
        #("t", auth_details.credentials.token),
        #("c", "somachord"),
        #("v", "1.16.0"),
        ..query
      ]),
    ),
  )
  |> uri.to_string
}

fn get_request(
  auth_details auth_details: auth.Auth,
  path path: String,
  query query: List(#(String, String)),
) {
  let assert Ok(req) = request.to(create_uri(auth_details, path, query))
  req
}

fn subsonic_response_decoder(
  inner: decode.Decoder(a),
) -> decode.Decoder(Result(a, SubsonicError)) {
  use status <- decode.subfield(["subsonic-response", "status"], decode.string)
  case status {
    "ok" ->
      inner
      |> decode.map(fn(a) { Ok(a) })
    "failed" -> {
      use code <- decode.subfield(
        ["subsonic-response", "error", "code"],
        decode.int,
      )
      use message <- decode.subfield(
        ["subsonic-response", "error", "message"],
        decode.string,
      )
      echo code
      echo message
      decode.success(
        Error(case code {
          40 -> WrongCredentials(message:)
          70 -> NotFound
          _ -> SubsonicError(code:, message:)
        }),
      )
    }
    _ -> panic as "no"
  }
}

pub fn cover_url(
  auth_details auth_details: auth.Auth,
  id id: String,
  size size: Int,
) {
  create_uri(auth_details, "/rest/getCoverArt.view", [
    #("id", id),
    #("size", size |> int.to_string),
  ])
}

pub fn stream(auth_details auth_details: auth.Auth, song song: api_models.Child) {
  create_uri(auth_details, "/rest/stream.view", [#("id", song.id)])
}

pub fn album_list(
  auth_details auth_details: auth.Auth,
  type_ type_: String,
  offset offset: Int,
  amount amount: Int,
  msg msg: Response(AlbumList, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getAlbumList2.view", query: [
      #("offset", int.to_string(offset)),
      #("size", int.to_string(amount)),
      #("type", type_),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use albums <- decode.then(decode.optionally_at(
          ["subsonic-response", "albumList2", "album"],
          [],
          decode.one_of(decode.list(api_models.album_decoder()), [
            { decode.success([]) },
          ]),
        ))
        decode.success(AlbumList(type_, albums))
      }),
      msg,
    ),
  )
}

pub fn album(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: Response(api_models.Album, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getAlbum.view", query: [#("id", id)])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use album <- decode.subfield(
          ["subsonic-response", "album"],
          api_models.album_decoder(),
        )
        decode.success(album)
      }),
      msg,
    ),
  )
}

pub fn artist(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: Response(api_models.Artist, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getArtist.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use artist <- decode.subfield(
          ["subsonic-response", "artist"],
          api_models.artist_decoder(),
        )

        decode.success(artist)
      }),
      msg,
    ),
  )
}

pub fn like(auth_details: auth.Auth, id id: String, msg msg: EmptyResponse(a)) {
  let req =
    get_request(auth_details:, path: "/rest/star.view", query: [#("id", id)])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn likes(
  auth_details auth_details: auth.Auth,
  msg msg: Response(List(api_models.Child), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getStarred2.view", query: [])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use songs <- decode.then(decode.optionally_at(
          ["subsonic-response", "starred2", "song"],
          [],
          decode.list(api_models.song_decoder()),
        ))

        decode.success(songs)
      }),
      msg,
    ),
  )
}

pub fn unlike(auth_details: auth.Auth, id id: String, msg msg: EmptyResponse(a)) {
  let req =
    get_request(auth_details:, path: "/rest/unstar.view", query: [#("id", id)])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn lyrics(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: Response(List(api_models.LyricSet), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getLyricsBySongId.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use lyrics <- decode.then(decode.optionally_at(
          ["subsonic-response", "lyricsList", "structuredLyrics"],
          [],
          decode.one_of(decode.list(api_models.lyric_set_decoder()), [
            { decode.success([]) },
          ]),
        ))

        decode.success(lyrics)
      }),
      msg,
    ),
  )
}

pub fn ping(auth_details auth_details: auth.Auth, msg msg: EmptyResponse(a)) {
  let req = get_request(auth_details:, path: "/rest/ping.view", query: [])
  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn playlists(
  auth_details auth_details: auth.Auth,
  msg msg: Response(List(api_models.Playlist), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getPlaylists.view", query: [])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use playlists <- decode.then(decode.optionally_at(
          ["subsonic-response", "playlists", "playlist"],
          [],
          decode.list(api_models.playlist_decoder()),
        ))

        decode.success(playlists)
      }),
      msg,
    ),
  )
}

pub fn playlist(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: Response(api_models.Playlist, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getPlaylist.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use playlist <- decode.subfield(
          ["subsonic-response", "playlist"],
          api_models.playlist_decoder(),
        )

        decode.success(playlist)
      }),
      msg,
    ),
  )
}

pub fn queue(auth_details: auth.Auth, msg: Response(queue.Queue, b)) {
  let req =
    get_request(auth_details:, path: "/rest/getPlayQueue.view", query: [])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
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
        let songs_indexed =
          list.index_map(songs, fn(idx, song) { #(song, idx) })
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

        decode.success(
          queue.Queue(
            ..queue.new(song_position:, songs: songs, position: 0),
            changed:,
          )
          |> queue.jump({ current_song.0 }),
        )
      }),
      msg,
    ),
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
pub fn save_queue(
  auth_details: auth.Auth,
  queue: option.Option(queue.Queue),
  msg: EmptyResponse(a),
) {
  let req =
    get_request(
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
    )

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn scrobble(
  auth_details auth_details: auth.Auth,
  id id: String,
  submission submission: Bool,
  msg msg: EmptyResponse(a),
) {
  let req =
    get_request(auth_details:, path: "/rest/scrobble.view", query: [
      #("id", id),
      #("submission", bool.to_string(submission) |> string.lowercase),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn search(
  auth_details: auth.Auth,
  query query: String,
  msg msg: Response(Search, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/search3.view", query: [
      #("query", query),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
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

        decode.success(Search(artists, albums))
      }),
      msg,
    ),
  )
}

pub fn similar_songs(
  auth_details: auth.Auth,
  id id: String,
  msg msg: Response(List(api_models.Child), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getSimilarSongs.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use songs <- decode.subfield(
          ["subsonic-response", "similarSongs", "song"],
          decode.list(api_models.song_decoder()),
        )
        decode.success(songs)
      }),
      msg,
    ),
  )
}

pub fn similar_songs_artist(
  auth_details: auth.Auth,
  id id: String,
  msg msg: Response(List(api_models.Child), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getSimilarSongs2.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use songs <- decode.subfield(
          ["subsonic-response", "similarSongs2", "song"],
          decode.list(api_models.song_decoder()),
        )
        decode.success(songs)
      }),
      msg,
    ),
  )
}

pub fn song(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: Response(api_models.Child, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getSong.view", query: [#("id", id)])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use song <- decode.subfield(
          ["subsonic-response", "song"],
          api_models.song_decoder(),
        )

        decode.success(song)
      }),
      msg,
    ),
  )
}

// gets most popular songs of an artist from last.fm
pub fn top_songs(
  auth_details auth_details: auth.Auth,
  artist_name artist_name: String,
  msg msg: Response(List(api_models.Child), b),
) {
  let req =
    get_request(auth_details:, path: "/rest/getTopSongs.view", query: [
      #("artist", artist_name),
      #("count", "5"),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use songs <- decode.subfield(
          ["subsonic-response", "topSongs", "song"],
          decode.list(api_models.song_decoder()),
        )
        decode.success(songs)
      }),
      msg,
    ),
  )
}

pub fn add_to_playlist(
  auth_details auth_details: auth.Auth,
  playlist_id playlist_id: String,
  song_id song_id: String,
  msg msg: EmptyResponse(a),
) {
  let req =
    get_request(auth_details:, path: "/rest/updatePlaylist.view", query: [
      #("playlistId", playlist_id),
      #("songIdToAdd", song_id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn remove_from_playlist(
  auth_details auth_details: auth.Auth,
  playlist_id playlist_id: String,
  song_id song_id: String,
  msg msg: EmptyResponse(a),
) {
  let req =
    get_request(auth_details:, path: "/rest/updatePlaylist.view", query: [
      #("playlistId", playlist_id),
      #("songIndexToRemove", song_id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn create_playlist(
  auth_details auth_details: auth.Auth,
  name name: String,
  songs songs: List(String),
  msg msg: Response(api_models.Playlist, b),
) {
  let req =
    get_request(auth_details:, path: "/rest/createPlaylist.view", query: [
      #("name", name),
      ..list.map(songs, fn(song_id: String) { #("songId", song_id) })
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use playlist <- decode.subfield(
          ["subsonic-response", "playlist"],
          api_models.playlist_decoder(),
        )

        decode.success(playlist)
      }),
      msg,
    ),
  )
}

pub fn update_playlist(
  auth_details auth_details: auth.Auth,
  id id: String,
  name name: String,
  description description: String,
  public public: Bool,
  msg msg: EmptyResponse(a),
) {
  let req =
    get_request(auth_details:, path: "/rest/updatePlaylist.view", query: [
      #("playlistId", id),
      #("name", name),
      #("comment", description),
      #("public", bool.to_string(public) |> string.lowercase),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn delete_playlist(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: EmptyResponse(a),
) {
  let req =
    get_request(auth_details:, path: "/rest/deletePlaylist.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}
