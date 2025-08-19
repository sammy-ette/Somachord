import gleam/option
import gleam/uri

import plinth/browser/window

pub type Msg {
  ChangeRoute(Route)
}

pub type Route {
  Home
  Login
  Search(query: String)
  Artist(id: String)
  Album(id: String)
  Song(id: String)
  Unknown
}

pub fn uri_to_route(uri: uri.Uri) -> Route {
  case uri.path {
    "/" -> Home
    "/login" -> Login
    "/search" -> Search("")
    "/search/" <> query -> {
      let assert Ok(decoded_query) = uri.percent_decode(query)
      Search(decoded_query)
    }
    "/artist/" <> id -> Artist(id)
    "/album/" <> id -> Album(id)
    "/song/" <> id -> Song(id)
    _ -> Unknown
  }
}

pub fn localhost() -> Bool {
  let route = get_route()
  case route.host, route.port {
    option.Some("localhost"), option.Some(1234)
    | option.Some("127.0.0.1"), option.Some(1234)
    -> True
    _, _ -> False
  }
}

pub fn root_uri() -> uri.Uri {
  let route = get_route()
  case localhost() {
    True -> {
      let assert Ok(local) = uri.parse("http://0.0.0.0:4747")
      local
    }
    False -> route
  }
}

pub fn root_url() -> String {
  root_uri() |> uri.to_string
}

pub fn direct(rel: String) -> String {
  let assert Ok(rel_url) = uri.parse(rel)
  let assert Ok(direction) = uri.merge(root_uri(), rel_url)
  uri.to_string(direction)
}

pub fn get_route() -> uri.Uri {
  let assert Ok(route) = uri.parse(window.location())
  route
}
