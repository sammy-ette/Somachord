import gleam/dynamic/decode
import sonata/api_helper
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
