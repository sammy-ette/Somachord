import electron
import gleam/option
import gleam/uri
import somachord/storage
import varasto

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
  Playlist(id: String)
  Likes

  Library
  Playlists
  Artists
  Albums
  About
  Unknown
}

pub fn uri_to_route(uri: uri.Uri) -> Route {
  let router = fn(path: String) {
    echo path
    case path {
      "/" | "" -> Home
      "/login" -> Login
      "/search" -> Search("")
      "/search/" <> query -> {
        let assert Ok(decoded_query) = uri.percent_decode(query)
        Search(decoded_query)
      }
      "/artists" -> Artists
      "/artist/" <> id -> Artist(id)
      "/albums" -> Albums
      "/album/" <> id -> Album(id)
      "/song/" <> id -> Song(id)
      "/playlist/" <> id -> Playlist(id)
      "/playlists/" -> Playlists
      "/library" -> Library
      "/likes" -> Likes
      "/about" -> About
      _ -> Unknown
    }
  }

  case electron.am_i_electron() {
    True ->
      case uri.fragment {
        option.None -> router("")
        option.Some(path) -> router(path)
      }
    False -> router(uri.path)
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
  case storage.create() |> varasto.get("auth") {
    Ok(stg) -> {
      let assert Ok(url) = uri.parse(stg.auth.server_url)
      url
    }
    Error(_) -> uri.empty
  }
}

pub fn root_url() -> String {
  root_uri() |> uri.to_string
}

pub fn direct(root: uri.Uri, rel: String) -> String {
  let assert Ok(rel_url) = uri.parse(rel)
  let assert Ok(direction) = uri.merge(root, rel_url)
  uri.to_string(direction)
}

pub fn get_route() -> uri.Uri {
  let assert Ok(route) = uri.parse(window.location())
  route
}
