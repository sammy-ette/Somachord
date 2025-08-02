import gleam/dynamic/decode
import gleam/int
import gleam/option
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
      use album <- decode.subfield(
        ["subsonic-response", "albumList2", "album"],
        decode.list(model.album_decoder()),
      )
      decode.success(api_helper.AlbumList(type_, album))
    },
    msg: msg.SubsonicResponse,
  )
}
