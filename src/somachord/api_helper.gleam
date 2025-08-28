import gleam/dynamic/decode
import gleam/http/request
import gleam/option
import gleam/uri
import rsvp

import somachord/api_models as model
import somachord/models/auth
import somachord/queue
import somachord/router

pub type Response {
  Ping
  Artist(model.Artist)
  TopSongs(List(model.Child))
  AlbumList(String, List(model.Album))
  Album(model.Album)
  Scrobble
  Song(model.Child)
  Search(
    artists: List(model.SmallArtist),
    albums: List(model.Album),
    songs: List(model.Child),
  )
  SimilarSongs(List(model.Child))
  Queue(queue.Queue)
  SubsonicError(code: Int, message: String, attempted_route: String)
}

pub fn create_uri(
  path: String,
  auth_details: auth.Auth,
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
        #("v", "6.1.4"),
        ..query
      ]),
    ),
  )
}

pub fn construct_req(
  auth_details auth_details: auth.Auth,
  path path: String,
  query query: List(#(String, String)),
  decoder decoder: decode.Decoder(Response),
  msg msg: fn(Result(Response, rsvp.Error)) -> b,
) {
  let assert Ok(req) =
    request.to(create_uri(path, auth_details, query) |> uri.to_string)
  rsvp.send(
    req,
    rsvp.expect_json(
      {
        use status <- decode.subfield(
          ["subsonic-response", "status"],
          decode.string,
        )
        case status {
          "ok" -> decoder
          "failed" -> {
            use code <- decode.subfield(
              ["subsonic-response", "error", "code"],
              decode.int,
            )
            use message <- decode.subfield(
              ["subsonic-response", "error", "message"],
              decode.string,
            )
            decode.success(SubsonicError(code:, message:, attempted_route: path))
          }
          _ -> panic as "this isnt supposed to happen wtf?"
        }
      },
      msg,
    ),
  )
}
