import gleam/bool
import gleam/dict
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/order
import gleam/pair
import gleam/result
import gleam/string
import gleam/uri
import lustre/event
import player
import plinth/browser/window
import sonata/api
import sonata/api_helper
import sonata/components/login
import sonata/components/song_detail
import sonata/pages/album
import sonata/pages/artist
import sonata/pages/home
import sonata/pages/song
import sonata/storage
import varasto

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
  let assert Ok(_) = artist.register()
  let assert Ok(_) = song.register()
  let assert Ok(_) = song_detail.register()
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
    model.Model(
      route:,
      layout:,
      storage: storage.create(),
      confirmed: False,
      albums: dict.new(),
      player: player.new(),
      queue: dict.new(),
      queue_position: 0,
      current_song: model.new_song(),
      seeking: False,
      seek_amount: 0,
      played_seconds: 0,
    )
  case
    router.get_route() |> router.uri_to_route,
    m.storage |> varasto.get("auth")
  {
    router.Login as route, _ | route, Ok(_) -> #(
      model.Model(..m, confirmed: True),
      effect.batch([
        modem.init(msg.on_url_change),
        route_effect(m, route),
        player.listen_events(m.player, player_event_handler),
      ]),
    )
    _, Error(_) -> {
      let assert Ok(login) = uri.parse("/login")
      #(m, modem.load(login))
    }
  }
}

fn route_effect(m: model.Model, route: router.Route) {
  case route {
    router.Album(id) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      api.album(auth_details, id)
    }
    _ -> effect.none()
  }
}

fn update(
  m: model.Model,
  msg: msg.Msg,
) -> #(model.Model, effect.Effect(msg.Msg)) {
  case msg {
    msg.Router(router.ChangeRoute(route)) -> #(
      model.Model(..m, route:),
      route_effect(m, route),
    )
    msg.SubsonicResponse(Ok(api_helper.Album(album))) -> #(
      model.Model(..m, albums: m.albums |> dict.insert(album.id, album)),
      effect.none(),
    )
    msg.SubsonicResponse(Error(e)) -> {
      echo e
      #(m, effect.none())
    }
    msg.Play(req) -> {
      echo "!!! play request id: " <> req.id
      echo "play request type: " <> req.type_
      case req.type_ {
        "album" -> {
          let auth_details = {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          }
          use <- bool.guard(m.albums |> dict.has_key(req.id), #(
            m,
            effect.none(),
          ))
          #(
            m,
            api.album(auth_details:, id: req.id)
              |> effect.map(fn(message: msg.Msg) {
                case message {
                  msg.SubsonicResponse(Error(e)) ->
                    msg.SubsonicResponse(Error(e))
                  msg.SubsonicResponse(Ok(api_helper.Album(album))) ->
                    msg.StreamAlbum(album)
                  m -> m
                }
              }),
          )
        }
        _ -> #(m, effect.none())
      }
    }
    msg.StreamAlbum(album) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      echo "getting first song"
      let assert Ok(song) = album.songs |> list.first
      let stream_uri =
        api_helper.create_uri("/rest/stream.view", auth_details, [
          #("id", song.id),
        ])
        |> uri.to_string

      m.player |> player.load_song(stream_uri, song)
      #(
        model.Model(
          ..m,
          queue: album.songs
            |> list.fold(#(dict.new(), 0), fn(acc, song) {
              let #(d, idx) = acc
              #(d |> dict.insert(idx, song), idx + 1)
            })
            |> pair.first,
          queue_position: 0,
        ),
        effect.none(),
      )
    }
    msg.MusicEnded | msg.PlayerNext -> {
      let queue_position = case
        int.compare(m.queue_position, m.queue |> dict.keys |> list.length)
      {
        order.Lt -> {
          let auth_details = {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          }
          echo "getting song"
          let assert Ok(song) = m.queue |> dict.get(m.queue_position + 1)
          let stream_uri =
            api_helper.create_uri("/rest/stream.view", auth_details, [
              #("id", song.id),
            ])
            |> uri.to_string
          m.player |> player.load_song(stream_uri, song)
          m.queue_position + 1
        }
        _ -> m.queue_position
      }

      #(
        model.Model(..m, queue_position:),
        api.scrobble(
          {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          id: m.current_song.id,
          submission: True,
        ),
      )
    }
    msg.PlayerSongLoaded(song) -> {
      #(
        model.Model(..m, current_song: song, played_seconds: 0),
        api.scrobble(
          {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          id: song.id,
          submission: False,
        ),
      )
    }
    msg.PlayerPrevious -> {
      m.player |> player.beginning()
      #(m, effect.none())
    }
    msg.PlayerPausePlay -> {
      m.player |> player.toggle_play()
      #(m, effect.none())
    }
    msg.ProgressDrag(amount) -> #(
      model.Model(..m, seek_amount: amount, seeking: True),
      effect.none(),
    )
    msg.PlayerSeek(amount) -> {
      m.player |> player.seek(amount)
      #(model.Model(..m, seeking: False), effect.none())
    }
    msg.Like -> {
      #(
        model.Model(
          ..m,
          current_song: model.Child(..m.current_song, starred: True),
        ),
        effect.none(),
      )
    }
    _ -> #(m, effect.none())
  }
}

fn player_event_handler(event: String, player: model.Player) -> msg.Msg {
  case event {
    "loaded" -> msg.PlayerSongLoaded(player |> player.current())
    "time" -> msg.PlayerTick(player |> player.time())
    "next" -> msg.PlayerNext
    "ended" -> msg.MusicEnded
    _ -> panic as "shouldnt happen"
  }
}

fn view(m: model.Model) {
  case m.confirmed {
    False -> element.none()
    True -> {
      let page = case m.route {
        router.Home -> home.element([msg.on_play(msg.Play)])
        router.Artist(id) ->
          artist.element([
            msg.on_play(msg.Play),
            attribute.attribute("artist-id", id),
          ])
        router.Album(id) -> album.page(m, id)
        router.Song(id) ->
          song.element([
            msg.on_play(msg.Play),
            attribute.attribute("song-id", id),
          ])
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

fn desktop_view(m: model.Model, page) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "font-['Poppins'] flex flex-col h-screen w-screen px-3 py-4 gap-2 overflow-auto",
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
              html.div([attribute.class("flex gap-2 items-center w-1/3")], [
                html.div(
                  [
                    attribute.class(
                      "w-14 h-14 bg-zinc-900 rounded-md flex items-center justify-center",
                    ),
                  ],
                  [
                    case m.current_song.cover_art_id == "" {
                      True ->
                        html.i(
                          [
                            attribute.class(
                              "text-zinc-500 text-3xl ph ph-music-notes-simple",
                            ),
                          ],
                          [],
                        )
                      False ->
                        html.img([
                          attribute.src(
                            api_helper.create_uri(
                              "/rest/getCoverArt.view",
                              auth_details,
                              [
                                #("id", m.current_song.cover_art_id),
                                #("size", "500"),
                              ],
                            )
                            |> uri.to_string,
                          ),
                          attribute.class("rounded-md object-cover"),
                        ])
                    },
                  ],
                ),
                html.div([attribute.class("flex flex-col")], [
                  html.span([attribute.class("font-medium text-nowrap")], [
                    element.text(m.current_song.title),
                  ]),
                  html.span(
                    [],
                    list.map(
                      m.current_song.artists,
                      fn(artist: model.SmallArtist) {
                        html.a([attribute.href("/artist/" <> artist.id)], [
                          html.span(
                            [
                              attribute.class(
                                "hover:underline font-light text-sm",
                              ),
                            ],
                            [element.text(artist.name)],
                          ),
                        ])
                      },
                    )
                      |> list.intersperse(element.text(", ")),
                  ),
                ]),
              ]),
              html.div([attribute.class("space-y-1")], [
                html.div(
                  [attribute.class("flex gap-4 justify-center items-center")],
                  [
                    html.i(
                      [attribute.class("text-xl ph ph-shuffle-simple")],
                      [],
                    ),
                    html.i(
                      [
                        attribute.class("text-xl ph-fill ph-skip-back"),
                        event.on_click(msg.PlayerPrevious),
                      ],
                      [],
                    ),
                    html.i(
                      [
                        attribute.class("text-4xl ph-fill"),
                        case m.player |> player.is_paused {
                          False -> attribute.class("ph-pause-circle")
                          True -> attribute.class("ph-play-circle")
                        },
                        event.on_click(msg.PlayerPausePlay),
                      ],
                      [],
                    ),
                    html.i(
                      [
                        attribute.class("text-xl ph-fill ph-skip-forward"),
                        event.on_click(msg.PlayerNext),
                      ],
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
                    html.span([], [
                      element.text({
                        let minutes =
                          float.round({ m.player |> player.time() }) / 60
                        let seconds =
                          float.round({ m.player |> player.time() }) % 60

                        int.to_string(minutes)
                        <> ":"
                        <> int.to_string(seconds) |> string.pad_start(2, "0")
                      }),
                    ]),
                    html.div(
                      [attribute.class("grid grid-cols-1 grid-rows-1 w-96")],
                      [
                        html.div(
                          [
                            attribute.class(
                              "col-start-1 row-start-1 bg-zinc-800 rounded-full h-1.5",
                            ),
                          ],
                          [
                            html.div(
                              [
                                attribute.class(
                                  "bg-zinc-100 rounded-full h-1.5",
                                ),
                                attribute.style(
                                  "width",
                                  float.to_string(
                                    case m.seeking {
                                      True -> int.to_float(m.seek_amount)
                                      False -> m.player |> player.time()
                                    }
                                    /. int.to_float(m.current_song.duration)
                                    *. 100.0,
                                  )
                                    <> "%",
                                ),
                              ],
                              [],
                            ),
                          ],
                        ),
                        html.input([
                          attribute.class(
                            "col-start-1 row-start-1 opacity-0 focus:ring-0 [&::-webkit-slider-thumb]:opacity-0 w-full h-1.5 rounded-full",
                          ),
                          attribute.value("0"),
                          attribute.max(int.to_string(m.current_song.duration)),
                          event.on("input", {
                            use value <- decode.subfield(
                              ["target", "value"],
                              decode.string,
                            )
                            let assert Ok(seek_amount) = int.parse(value)
                            echo seek_amount
                            decode.success(msg.ProgressDrag(seek_amount))
                          }),
                          event.on("change", {
                            use value <- decode.subfield(
                              ["target", "value"],
                              decode.string,
                            )
                            let assert Ok(seek_amount) = int.parse(value)
                            echo "change event " <> value
                            decode.success(msg.PlayerSeek(seek_amount))
                          }),
                          attribute.type_("range"),
                        ]),
                      ],
                    ),
                    html.span([], [
                      element.text({
                        let minutes = m.current_song.duration / 60
                        let seconds = m.current_song.duration % 60

                        int.to_string(minutes)
                        <> ":"
                        <> int.to_string(seconds) |> string.pad_start(2, "0")
                      }),
                    ]),
                  ],
                ),
              ]),
              html.div([attribute.class("flex justify-end gap-2 w-1/3")], [
                html.i(
                  [
                    case m.current_song.starred {
                      True -> attribute.class("ph-fill text-violet-500")
                      False -> attribute.class("ph")
                    },
                    attribute.class("text-3xl ph-heart-straight"),
                    event.on_click(msg.Like),
                  ],
                  [],
                ),
                html.i([attribute.class("text-3xl ph ph-plus-circle")], []),
              ]),
            ],
          ),
        ]),
      ]),
    ],
  )
}

fn mobile_view(m: model.Model, page) {
  html.div(
    [
      attribute.class(
        "font-['Poppins'] h-screen w-screen flex relative flex-col p-4 gap-2 overflow-none",
      ),
    ],
    [
      page,
      // todo: figure out how to make this stick to the bottom while having scroll
      html.div([attribute.class("")], [
        html.div([attribute.class("flex justify-evenly")], [
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-house")], []),
            html.i([attribute.class("text-3xl ph-fill ph-house")], []),
            "Home",
            m.route == router.Home,
            [],
          ),
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-sparkles")], []),
            html.i([attribute.class("text-3xl ph-fill ph-sparkles")], []),
            "Discover",
            False,
            [],
          ),
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            "Search",
            False,
            [],
          ),
          // mobile_nav_button(
        //   html.i([attribute.class("text-3xl ph ph-cards-three")], []),
        //   html.i([attribute.class("text-3xl ph ph-cards-three")], []),
        //   "Library",
        //   False,
        //   [],
        // ),
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
