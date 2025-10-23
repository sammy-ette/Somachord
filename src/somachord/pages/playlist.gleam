import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/uri
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import player
import rsvp
import somachord/api/api
import somachord/api_helper
import somachord/api_models
import somachord/components
import somachord/elements
import somachord/model
import somachord/storage
import varasto

pub type Msg {
  PlaylistID(String)
  PlaylistResponse(
    Result(Result(api_models.Playlist, api.SubsonicError), rsvp.Error),
  )
  PlayPlaylist(index: Int)
  ComponentClick
}

pub type Model {
  Model(playlist: api_models.Playlist, layout: model.Layout)
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.on_attribute_change("playlist-id", fn(value) {
        Ok(value |> PlaylistID)
      }),
    ])
  lustre.register(app, "playlist-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "playlist-page",
    [
      attribute.class(
        "flex-1 p-8 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
      ),
      ..attrs
    ],
    [],
  )
}

fn init(_) {
  #(
    Model(playlist: api_models.new_playlist(), layout: components.layout()),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    PlaylistID(id) -> {
      #(
        m,
        api.playlist(
          auth_details: {
            let assert Ok(stg) = storage.create() |> varasto.get("auth")
            stg.auth
          },
          id:,
          msg: PlaylistResponse,
        ),
      )
    }
    PlaylistResponse(Ok(Ok(playlist))) -> #(
      Model(..m, playlist:),
      effect.none(),
    )
    PlaylistResponse(e) -> {
      echo e
      #(m, effect.none())
    }
    PlayPlaylist(index) -> #(
      m,
      event.emit("play", play_json(m.playlist.id, index)),
    )
    ComponentClick -> #(m, effect.none())
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
  html.div(
    [
      attribute.class("flex-1 flex gap-4"),
      case m.layout {
        model.Desktop -> attribute.class("overflow-hidden")
        model.Mobile -> attribute.class("flex-col overflow-y-auto")
      },
    ],
    case m.layout, page(m) {
      model.Desktop, elems -> elems
      model.Mobile, elems -> elems |> list.reverse
    },
  )
}

fn page(m: Model) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  [
    html.div(
      [
        attribute.class("flex-1 flex flex-col gap-6"),
        case m.layout {
          model.Desktop -> attribute.class("overflow-y-auto pr-4")
          model.Mobile -> attribute.none()
        },
        attribute.class(elements.scrollbar_class),
      ],
      [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(m.playlist.name),
        ]),
        html.div(
          [
            attribute.class(
              "flex-wrap flex gap-3 text-xs text-zinc-400 items-center",
            ),
          ],
          [
            html.span([], [
              element.text("by "),
              html.span([attribute.class("text-white")], [
                element.text(m.playlist.owner),
              ]),
            ]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("text-nowrap")], [
              element.text({
                let songs = m.playlist.songs
                let song_count = songs |> list.length

                int.to_string(song_count)
                <> " song"
                <> case song_count == 1 {
                  False -> "s"
                  True -> ""
                }
              }),
            ]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("text-nowrap")], [
              element.text({
                let minutes = m.playlist.duration / 60
                let seconds = m.playlist.duration % 60

                int.to_string(minutes)
                <> " min, "
                <> int.to_string(seconds)
                <> " sec"
              }),
            ]),
          ],
        ),
        // case m.layout {
        //   model.Mobile ->
        //     html.div(
        //       [attribute.class("flex flex-wrap gap-4")],
        //       list.map(album.genres, elements.tag),
        //     )
        //   model.Desktop -> element.none()
        // },
        buttons(m),
        html.div([attribute.class("flex flex-col gap-4")], [
          case m.layout {
            model.Mobile -> components.mobile_space()
            model.Desktop -> element.none()
          },
          ..list.index_map(
            m.playlist.songs,
            fn(song: api_models.Child, index: Int) {
              elements.song(
                song,
                index:,
                attrs: case m.layout {
                  model.Desktop -> [attribute.none()]
                  model.Mobile -> [
                    event.on_click(PlayPlaylist(index)),
                    attribute.class(
                      "transition-all active:scale-[98%] active:bg-zinc-900",
                    ),
                  ]
                },
                cover_art: True,
                msg: { PlayPlaylist(index) },
              )
            },
          )
        ]),
        // html.div(
      //   [attribute.class("flex flex-col gap-4")],
      //   [
      //     case m.layout {
      //       model.Mobile -> components.mobile_space()
      //       model.Desktop -> element.none()
      //     },
      //     ..list.index_map(
      //       m.playlist.songs,
      //       fn(song: api_models.Child, index: Int) {
      //         elements.song(
      //           song,
      //           index:,
      //           attrs: case m.layout {
      //             model.Desktop -> [attribute.none()]
      //             model.Mobile -> [
      //               event.on_click(msg.StreamAlbum(album, index)),
      //               attribute.class(
      //                 "transition-all active:scale-[98%] active:bg-zinc-900",
      //               ),
      //             ]
      //           },
      //           cover_art: False,
      //           msg: { msg.StreamAlbum(album, index) },
      //         )
      //       },
      //     )
      //     |> list.reverse
      //   ]
      //     |> list.reverse,
      // ),
      ],
    ),
    html.div([attribute.class("flex flex-col gap-8")], [
      html.img([
        attribute.src(
          api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
            #("id", m.playlist.cover_art_id),
            #("size", "500"),
          ])
          |> uri.to_string,
        ),
        attribute.class(
          "self-center w-52 h-52 md:w-80 md:h-80 object-scale rounded-md",
        ),
      ]),
      //   case m.layout {
    //     model.Mobile -> element.none()
    //     model.Desktop ->
    //       html.div(
    //         [attribute.class("flex flex-wrap gap-4")],
    //         list.map(album.genres, elements.tag),
    //       )
    //   },
    ]),
  ]
}

fn buttons(m: Model) {
  case m.layout {
    model.Desktop ->
      html.div([attribute.class("text-zinc-400 flex gap-4 items-center")], [
        html.i(
          [
            attribute.class("text-5xl text-violet-500 ph-fill ph-play-circle"),
            event.on_click({ PlayPlaylist(0) }),
          ],
          [],
        ),
        html.i(
          [
            attribute.class("text-3xl ph ph-shuffle-simple cursor-not-allowed"),
          ],
          [],
        ),
        html.i(
          [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
          [],
        ),
        html.i(
          [
            attribute.class("text-3xl ph ph-download-simple cursor-not-allowed"),
          ],
          [],
        ),
        html.i(
          [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
          [],
        ),
      ])
    model.Mobile ->
      html.div(
        [
          attribute.class(
            "text-zinc-400 flex gap-4 items-center justify-between",
          ),
        ],
        [
          html.div([attribute.class("flex gap-4 items-center")], [
            html.i(
              [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
              [],
            ),
            html.i(
              [
                attribute.class(
                  "text-3xl ph ph-shuffle-simple cursor-not-allowed",
                ),
              ],
              [],
            ),
            html.i(
              [
                attribute.class(
                  "text-5xl text-violet-500 ph-fill ph-play-circle",
                ),
                event.on_click({ PlayPlaylist(0) }),
              ],
              [],
            ),
          ]),
          html.i(
            [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
            [],
          ),
        ]
          |> list.reverse,
      )
  }
}
