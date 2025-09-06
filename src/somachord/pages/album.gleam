import gleam/dict
import gleam/int
import gleam/list
import gleam/result
import gleam/uri
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api_helper
import somachord/api_models
import somachord/components
import somachord/elements
import somachord/model
import somachord/msg
import somachord/storage
import varasto

pub fn page(m: model.Model, id: String) {
  html.div(
    [
      attribute.class("flex-1 flex gap-4 p-8 rounded-md border border-zinc-800"),
      case m.layout {
        model.Desktop -> attribute.class("overflow-hidden")
        model.Mobile -> attribute.class("flex-col overflow-y-auto")
      },
    ],
    case m.layout, desktop_page(m, id) |> result.unwrap_both {
      model.Desktop, elems -> elems
      model.Mobile, elems -> elems |> list.reverse
    },
  )
}

pub fn desktop_page(m: model.Model, id) {
  use album <- result.try(
    m.albums
    |> dict.get(id)
    |> result.replace_error([
      html.div(
        [
          attribute.class(
            "flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-8",
          ),
          attribute.class(elements.scrollbar_class),
        ],
        [
          // album name
          html.div([attribute.class("py-1 h-12 w-48")], [
            html.div(
              [attribute.class("w-full h-full animate-pulse bg-zinc-800")],
              [],
            ),
          ]),
          // album info
          html.div([attribute.class("py-2 h-8 w-80")], [
            html.div(
              [attribute.class("w-full h-full animate-pulse bg-zinc-800")],
              [],
            ),
          ]),
        ],
      ),
    ]),
  )

  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  Ok([
    html.div(
      [
        attribute.class("flex-1 flex flex-col gap-6"),
      ],
      [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(album.name),
        ]),
        html.div(
          [
            attribute.class(
              "flex-wrap flex gap-3 text-xs text-zinc-400 items-center",
            ),
          ],
          [
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-user-sound")], []),
              ..list.map(album.artists, fn(artist: api_models.SmallArtist) {
                html.a([attribute.href("/artist/" <> artist.id)], [
                  html.span(
                    [
                      attribute.class(
                        "text-zinc-300 text-nowrap hover:underline",
                      ),
                    ],
                    [
                      element.text(artist.name),
                    ],
                  ),
                ])
              })
              |> list.intersperse(element.text(", "))
            ]),
            html.span([], [element.text("•")]),
            html.span([], [element.text(album.year |> int.to_string)]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("text-nowrap")], [
              element.text({
                let song_count = album.songs |> list.length

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
                let minutes = album.duration / 60
                let seconds = album.duration % 60

                int.to_string(minutes)
                <> " min, "
                <> int.to_string(seconds)
                <> " sec"
              }),
            ]),
          ],
        ),
        case m.layout {
          model.Mobile ->
            html.div(
              [attribute.class("flex flex-wrap gap-4")],
              list.map(album.genres, elements.tag),
            )
          model.Desktop -> element.none()
        },
        buttons(m, album),
        html.div(
          [attribute.class("flex flex-col gap-4")],
          [
            components.mobile_space(),
            ..list.index_map(
              album.songs,
              fn(song: api_models.Child, index: Int) {
                elements.song(
                  song,
                  index:,
                  attrs: case m.layout {
                    model.Desktop -> [attribute.none()]
                    model.Mobile -> [
                      event.on_click(msg.StreamAlbum(album, index)),
                      attribute.class(
                        "transition-all active:scale-[98%] active:bg-zinc-900",
                      ),
                    ]
                  },
                  cover_art: False,
                  msg: { msg.StreamAlbum(album, index) },
                )
              },
            )
            |> list.reverse
          ]
            |> list.reverse,
        ),
      ],
    ),
    html.div([attribute.class("flex flex-col gap-8")], [
      html.img([
        attribute.src(
          api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
            #("id", album.cover_art_id),
            #("size", "500"),
          ])
          |> uri.to_string,
        ),
        attribute.class(
          "self-center w-52 h-52 md:max-w-80 md:max-h-80 object-scale rounded-md",
        ),
      ]),
      case m.layout {
        model.Mobile -> element.none()
        model.Desktop ->
          html.div(
            [attribute.class("flex flex-wrap gap-4")],
            list.map(album.genres, elements.tag),
          )
      },
    ]),
  ])
}

fn buttons(m: model.Model, album: api_models.Album) {
  case m.layout {
    model.Desktop ->
      html.div([attribute.class("text-zinc-400 flex gap-4 items-center")], [
        html.i(
          [
            attribute.class("text-5xl text-violet-500 ph-fill ph-play-circle"),
            event.on_click({ msg.StreamAlbum(album, 0) }),
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
                event.on_click({ msg.StreamAlbum(album, 0) }),
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
