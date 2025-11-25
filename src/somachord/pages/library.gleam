import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/string
import gleam/uri
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import plinth/browser/service_worker
import rsvp
import somachord/api/api
import somachord/api/models as api_models
import somachord/pages/error

import somachord/components
import somachord/elements
import somachord/model
import somachord/storage
import varasto

pub type Display {
  Grid
  List
}

type Model {
  Model(
    playlists: List(api_models.Playlist),
    display: Display,
    search_query: String,
    page_error: option.Option(error.ErrorType),
  )
}

pub type Msg {
  ChangeDisplay(Display)
  Search(String)

  Playlists(
    Result(Result(List(api_models.Playlist), api.SubsonicError), rsvp.Error),
  )
  PlayPlaylist(id: String)
  RetryPlaylists

  Nothing
}

pub fn register() {
  let app = lustre.component(init, update, view, [])
  lustre.register(app, "library-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "library-page",
    [
      attribute.class(
        "flex-1 rounded-md border border-zinc-800 overflow-x-hidden overflow-y-auto",
      ),
      attribute.class(elements.scrollbar_class),
      ..attrs
    ],
    [],
  )
}

fn init(_) {
  let storage = storage.create()

  #(
    Model(
      playlists: [],
      search_query: "",
      display: case components.layout() {
        model.Mobile -> List
        model.Desktop -> Grid
      },
      page_error: option.None,
    ),
    case storage |> varasto.get("auth") {
      Ok(stg) -> api.playlists(stg.auth, Playlists)
      Error(_) -> effect.none()
    },
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    ChangeDisplay(display) -> #(Model(..m, display: display), effect.none())
    Playlists(Ok(Ok(playlists))) -> #(
      Model(..m, playlists: playlists),
      effect.none(),
    )
    Playlists(Error(e)) -> #(
      Model(..m, page_error: option.Some(error.from_rsvp(e))),
      effect.none(),
    )
    RetryPlaylists -> #(
      Model(..m, page_error: option.None),
      api.playlists(
        {
          let assert Ok(stg) = storage.create() |> varasto.get("auto")
          stg.auth
        },
        Playlists,
      ),
    )
    PlayPlaylist(id) -> #(m, event.emit("play", play_json(id, 0)))
    _ -> #(m, effect.none())
  }
}

fn play_json(id: String, index: Int) {
  json.object([
    #("id", json.string(id)),
    #("type", json.string("playlist")),
    #("index", json.int(index)),
  ])
}

fn view(m: Model) {
  case m.page_error {
    option.None -> real_view(m)
    option.Some(e) -> error.page(e, event.on_click(RetryPlaylists))
  }
}

fn real_view(m: Model) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [attribute.class("flex flex-col"), components.redirect_click(Nothing)],
    [
      html.div(
        [
          attribute.class(
            "px-6 py-4 sticky top-0 z-50 bg-zinc-950 text-zinc-400 space-x-12 inline-flex",
          ),
        ],
        [
          html.div([attribute.class("space-x-4")], [
            html.i(
              [
                active_button(m, Grid),
                event.on_click(ChangeDisplay(Grid)),
                attribute.class("p-2 text-3xl ph ph-squares-four"),
              ],
              [],
            ),
            html.i(
              [
                active_button(m, List),
                event.on_click(ChangeDisplay(List)),
                attribute.class("p-2 text-3xl ph ph-list-bullets"),
              ],
              [],
            ),
          ]),
          // TODO: sorting
        // html.div([attribute.class("space-x-2")], [
        //   html.i([attribute.class("text-3xl ph ph-arrows-down-up")], []),
        //   html.span([attribute.class("h-fit align-super")], [
        //     element.text("Date Updated"),
        //   ]),
        // ]),
        ],
      ),
      case m.display {
        Grid ->
          html.div(
            [
              attribute.class(
                "px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
              ),
            ],
            list.map(m.playlists |> search_filter(m.search_query), fn(playlist) {
              elements.playlist(playlist, PlayPlaylist)
            }),
          )
        List ->
          html.div(
            [attribute.class("flex flex-col")],
            list.map(m.playlists |> search_filter(m.search_query), fn(playlist) {
              html.div(
                [
                  attribute.class(
                    "flex items-center px-4 py-3 border-b border-zinc-800 hover:bg-zinc-900 gap-4",
                  ),
                ],
                [
                  html.div(
                    [
                      attribute.class(
                        "w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center",
                      ),
                    ],
                    [
                      case playlist.cover_art_id == "" {
                        True ->
                          html.i(
                            [
                              attribute.class(
                                "text-zinc-500 text-xl ph ph-music-notes-simple",
                              ),
                            ],
                            [],
                          )
                        False ->
                          html.a([attribute.href("/album/" <> playlist.id)], [
                            html.img([
                              attribute.src(api.cover_url(
                                auth_details,
                                playlist.cover_art_id,
                                500,
                              )),
                              attribute.class(
                                "hover:opacity-50 transition-all duration-200 rounded-md object-cover",
                              ),
                            ]),
                          ])
                      },
                    ],
                  ),
                  html.div([attribute.class("flex flex-col")], [
                    html.a([attribute.href("/playlist/" <> playlist.id)], [
                      html.span(
                        [
                          attribute.class(
                            "hover:underline font-medium text-zinc-200",
                          ),
                        ],
                        [element.text(playlist.name)],
                      ),
                    ]),
                    html.span(
                      [attribute.class("text-xs font-light text-zinc-500")],
                      [
                        element.text(
                          int.to_string(playlist.song_count)
                          <> " song"
                          <> case playlist.song_count == 1 {
                            False -> "s"
                            True -> ""
                          },
                        ),
                      ],
                    ),
                  ]),
                  html.div([attribute.class("flex flex-1 justify-end")], [
                    html.i(
                      [
                        event.on_click(PlayPlaylist(playlist.id)),
                        attribute.class("text-lg ph-fill ph-play"),
                      ],
                      [],
                    ),
                  ]),
                ],
              )
            }),
          )
      },
    ],
  )
}

fn active_button(m: Model, target: Display) {
  case m.display == target {
    True -> attribute.class("bg-zinc-800 text-zinc-300 rounded-md")
    False -> attribute.none()
  }
}

fn search_filter(
  playlists: List(api_models.Playlist),
  query: String,
) -> List(api_models.Playlist) {
  case query == "" {
    True -> playlists
    False -> {
      list.filter(playlists, fn(playlist) {
        string.lowercase(playlist.name)
        |> string.contains(string.lowercase(query))
      })
    }
  }
}
