import gleam/dynamic/decode
import gleam/http/request
import gleam/list
import gleam/option
import gleam/result
import gleam/uri
import rsvp
import somachord/api_models
import somachord/models/auth
import somachord/router

pub type SubsonicError {
  WrongCredentials(message: String)
  SubsonicError(code: Int, message: String)
}

fn get_request(
  auth_details auth_details: auth.Auth,
  path path: String,
  query query: List(#(String, String)),
) {
  let assert Ok(root) = auth_details.server_url |> uri.parse
  let assert Ok(original_uri) = uri.parse(router.direct(root, path))

  let assert Ok(req) =
    request.to(
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
      |> uri.to_string,
    )
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
      echo message
      decode.success(
        Error(case code {
          40 -> WrongCredentials(message:)
          _ -> SubsonicError(code:, message:)
        }),
      )
    }
    _ -> panic as "no"
  }
}

pub fn ping(
  auth_details auth_details: auth.Auth,
  msg msg: fn(Result(Result(Nil, SubsonicError), rsvp.Error)) -> e,
) {
  let req = get_request(auth_details:, path: "/rest/ping.view", query: [])
  rsvp.send(
    req,
    rsvp.expect_json(subsonic_response_decoder(decode.success(Nil)), msg),
  )
}

pub fn lyrics(
  auth_details auth_details: auth.Auth,
  id id: String,
  msg msg: fn(
    Result(Result(List(api_models.LyricSet), SubsonicError), rsvp.Error),
  ) ->
    e,
) {
  let req =
    get_request(auth_details:, path: "/rest/getLyricsBySongId.view", query: [
      #("id", id),
    ])

  rsvp.send(
    req,
    rsvp.expect_json(
      subsonic_response_decoder({
        use lyrics <- decode.subfield(
          ["subsonic-response", "lyricsList", "structuredLyrics"],
          decode.list(api_models.lyric_set_decoder()),
        )

        decode.success(lyrics)
      }),
      msg,
    ),
  )
}
