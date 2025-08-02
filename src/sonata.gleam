import gleam/io
import gleam/list
import gleam/result
import gleam/uri
import gleroglero/mini
import gleroglero/solid
import plinth/browser/window
import sonata/components/artist_detail
import sonata/components/login
import sonata/components/song_detail
import sonata/pages/album
import sonata/pages/artist
import sonata/pages/home
import sonata/pages/song
import sonata/storage
import varasto

import gleroglero/outline
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import modem

import sonata/model
import sonata/msg
import sonata/router

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = login.register()
  let assert Ok(_) = home.register()
  let assert Ok(_) = song_detail.register()
  let assert Ok(_) = artist_detail.register()
  let assert Ok(_) = lustre.start(app, "#app", 0)
}

fn init(_) {
  let route =
    modem.initial_uri()
    |> fn(uri) {
      case uri {
        Ok(a) -> router.uri_to_route(a)
        _ -> router.Home
      }
    }

  let layout = case window.self() |> window.inner_width() < 800 {
    True -> model.Mobile
    False -> model.Desktop
  }

  echo layout

  let m =
    model.Model(route:, layout:, storage: storage.create(), confirmed: False)
  case
    router.get_route() |> router.uri_to_route,
    m.storage |> varasto.get("auth")
  {
    router.Login, _ | _, Ok(_) -> #(
      model.Model(..m, confirmed: True),
      modem.init(on_url_change),
    )
    _, Error(_) -> {
      let assert Ok(login) = uri.parse("/login")
      #(m, modem.load(login))
    }
  }
}

fn on_url_change(url: uri.Uri) -> msg.Msg {
  router.uri_to_route(url) |> router.ChangeRoute |> msg.Router
}

fn update(
  m: model.Model,
  msg: msg.Msg,
) -> #(model.Model, effect.Effect(msg.Msg)) {
  case msg {
    msg.Router(router.ChangeRoute(route)) -> #(
      model.Model(..m, route:),
      effect.none(),
    )
    _ -> #(m, effect.none())
  }
}

fn view(m: model.Model) {
  case m.confirmed {
    False -> element.none()
    True -> {
      let page = case m.route {
        router.Home -> home.element()
        router.Artist(id) -> artist.page()
        router.Album(id) -> album.page(m)
        router.Song(id) -> song.page()
        _ -> element.none()
      }

      let page_that_got_laid = case m.layout {
        model.Mobile -> mobile_view(m, page)
        model.Desktop -> desktop_view(m, page)
      }

      case m.route {
        router.Login -> login.element()
        _ -> page_that_got_laid
      }
    }
  }
}

fn mobile_view(m: model.Model, page) {
  html.div(
    [
      attribute.class(
        "font-['Poppins'] h-screen flex relative flex-col p-4 gap-2 overflow-none",
      ),
    ],
    [
      page,
      // todo: figure out how to make this stick to the bottom while having scroll
      html.div([attribute.class("")], [
        html.div([attribute.class("flex justify-evenly")], [
          mobile_nav_button(
            outline.home(),
            mini.home(),
            "Home",
            m.route == router.Home,
            [],
          ),
          mobile_nav_button(
            outline.sparkles(),
            solid.sparkles(),
            "Discover",
            False,
            [],
          ),
          mobile_nav_button(
            outline.magnifying_glass(),
            solid.magnifying_glass_circle(),
            "Search",
            False,
            [],
          ),
          mobile_nav_button(
            outline.queue_list(),
            solid.queue_list(),
            "Library",
            False,
            [],
          ),
        ]),
      ]),
    ],
  )
}

fn mobile_nav_button(inactive, active, name, is_active, attrs) {
  html.div(
    [
      attribute.class("flex flex-col gap-2 items-center"),
      case is_active {
        True -> attribute.class("bg-zinc-900 text-zinc-100")
        False -> attribute.class("text-zinc-500")
      },
      ..attrs
    ],
    [
      html.div([attribute.class("h-8 w-8")], [
        case is_active {
          True -> active
          False -> inactive
        },
      ]),
      html.h1([], [element.text(name)]),
    ],
  )
}

fn desktop_view(m: model.Model, page) {
  html.div(
    [
      attribute.class(
        "font-['Poppins'] flex flex-col h-screen px-3 py-4 gap-2 overflow-hidden",
      ),
    ],
    [
      html.div([attribute.class("flex gap-4")], [
        button(
          html.i([attribute.class("text-3xl ph ph-cards-three")], []),
          "Library",
          [attribute.class("w-42")],
        ),
        html.a([attribute.href("/")], [
          nav_button(
            html.i([attribute.class("text-3xl ph ph-house")], []),
            html.i([attribute.class("text-3xl ph-fill ph-house")], []),
            "Home",
            m.route == router.Home,
            [attribute.class("w-42")],
          ),
        ]),
        button(
          html.i([attribute.class("text-3xl ph ph-sparkle")], []),
          "Discover",
          [attribute.class("w-42")],
        ),
      ]),
      html.div([attribute.class("flex-1 min-h-0 flex gap-2")], [
        html.div(
          [
            attribute.class(
              "flex flex-col gap-2 border border-zinc-800 rounded-lg py-4 px-1",
            ),
          ],
          [
            button(
              html.i([attribute.class("text-3xl ph ph-playlist")], []),
              "Playlists",
              [],
            ),
            button(
              html.i([attribute.class("text-3xl ph ph-heart-straight")], []),
              "Liked Songs",
              [],
            ),
            html.a([attribute.href("/album/")], [
              button(
                html.i([attribute.class("text-3xl ph ph-vinyl-record")], []),
                "Albums",
                [],
              ),
            ]),
            html.a([attribute.href("/artist/")], [
              button(
                html.i([attribute.class("text-3xl ph ph-user-sound")], []),
                "Artists",
                [],
              ),
            ]),
          ],
        ),
        html.div([attribute.class("flex-1 flex flex-col gap-2")], [
          page,
          html.div(
            [
              attribute.class(
                "h-20 rounded-lg p-4 border border-zinc-800 flex items-center justify-between",
              ),
            ],
            [
              html.div([attribute.class("flex gap-2 items-center")], [
                html.img([
                  attribute.src(
                    "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg",
                  ),
                  attribute.class("w-14 h-14 object-cover rounded-md"),
                ]),
                html.div([attribute.class("flex flex-col")], [
                  html.span([attribute.class("font-medium")], [
                    element.text("Track Name"),
                  ]),
                  html.span([attribute.class("font-light text-sm")], [
                    element.text("Artist"),
                  ]),
                ]),
              ]),
              html.div([attribute.class("space-y-2")], [
                html.div(
                  [attribute.class("flex gap-4 items-center justify-center")],
                  [
                    html.i(
                      [attribute.class("text-xl ph ph-shuffle-simple")],
                      [],
                    ),
                    html.i(
                      [attribute.class("text-xl ph-fill ph-skip-back")],
                      [],
                    ),
                    html.i(
                      [attribute.class("text-4xl ph-fill ph-play-circle")],
                      [],
                    ),
                    html.i(
                      [attribute.class("text-xl ph-fill ph-skip-forward")],
                      [],
                    ),
                    html.i([attribute.class("text-xl ph ph-repeat")], []),
                  ],
                ),
                html.div(
                  [
                    attribute.class(
                      "flex gap-2 items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]",
                    ),
                  ],
                  [
                    html.span([], [element.text("0:00")]),
                    html.div(
                      [attribute.class("w-96 bg-zinc-800 rounded-full h-1.5")],
                      [
                        html.div(
                          [
                            attribute.class("bg-zinc-100 rounded-full h-1.5"),
                            attribute.style("width", "45%"),
                          ],
                          [],
                        ),
                      ],
                    ),
                    html.span([], [element.text("3:14")]),
                  ],
                ),
              ]),
              html.div([attribute.class("flex gap-2")], [
                html.i([attribute.class("text-3xl ph ph-heart-straight")], []),
                html.i([attribute.class("text-3xl ph ph-plus-circle")], []),
              ]),
            ],
          ),
        ]),
      ]),
    ],
  )
}

fn nav_button(inactive, active, name, is_active, attrs) {
  html.div(
    [
      attribute.class(
        "w-52 font-normal flex gap-4 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg",
      ),
      case is_active {
        True -> attribute.class("bg-zinc-900 text-zinc-100")
        False -> attribute.class("text-zinc-500")
      },
      ..attrs
    ],
    [
      html.div([attribute.class("h-8 w-8")], [
        case is_active {
          True -> active
          False -> inactive
        },
      ]),
      html.h1([], [element.text(name)]),
    ],
  )
}

fn button(icon, name, attrs) {
  html.div(
    [
      attribute.class(
        "w-52 text-zinc-500 font-normal flex gap-2 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg",
      ),
      ..attrs
    ],
    [
      html.div([attribute.class("h-8 w-8")], [icon]),
      html.h1([], [element.text(name)]),
    ],
  )
}
