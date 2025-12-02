import gleam/dict
import gleam/int
import gleam/list
import gleam/result
import gleam/uri
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api/api
import somachord/api/models as api_models
import somachord/elements/button

import somachord/components
import somachord/elements
import somachord/model
import somachord/msg
import somachord/storage
import varasto

pub fn page(m: model.Model, id: String) {
  html.div(
    [
      attribute.class("flex-1 flex gap-4 p-8 rounded-md border-zinc-800"),
      case m.layout {
        model.Desktop -> attribute.class("border overflow-hidden")
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
        case m.layout {
          model.Desktop -> attribute.class("overflow-y-auto pr-4")
          model.Mobile -> attribute.none()
        },
        attribute.class(elements.scrollbar_class),
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
              elements.artists(album.artists, []),
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
            case m.layout {
              model.Mobile -> components.mobile_space()
              model.Desktop -> element.none()
            },
            ..list.index_map(
              album.songs,
              fn(song: api_models.Child, index: Int) {
                elements.song(
                  song,
                  attrs: [
                    attribute.attribute(
                      "data-index",
                      index + 1 |> int.to_string,
                    ),
                    case m.current_song.id == song.id {
                      True -> attribute.attribute("data-playing", "")
                      False -> attribute.none()
                    },
                  ],
                  cover_art: False,
                  msg: { msg.StreamAlbum(album, index) },
                  on_add_queue: #(True, msg.AddToQueue(song)),
                )
              },
            )
            |> list.reverse
          ]
            |> list.reverse,
        ),
      ],
    ),
    html.div([attribute.class("flex flex-col gap-8 select-none")], [
      html.img([
        attribute.src(api.cover_url(auth_details, album.cover_art_id, 500)),
        attribute.class(
          "self-center w-52 h-52 md:w-80 md:h-80 object-scale rounded-md",
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
        button.button(button.Play, button.Largest, [
          attribute.class("text-violet-500"),
          event.on_click({ msg.StreamAlbum(album, 0) }),
        ]),
        button.button(button.Shuffle, button.Medium, [
          event.on_click({ msg.StreamAlbumShuffled(album, 0) }),
        ]),
        // html.i(
      //   [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
      //   [],
      // ),
      // html.i(
      //   [
      //     attribute.class("text-3xl ph ph-download-simple cursor-not-allowed"),
      //   ],
      //   [],
      // ),
      // button.disabled_button(button.MoreHorizontal, button.Medium, []),
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
            // html.i(
            //   [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
            //   [],
            // ),
            button.button(button.Shuffle, button.Medium, [
              event.on_click({ msg.StreamAlbumShuffled(album, 0) }),
            ]),
            button.button(button.Play, button.Largest, [
              attribute.class("text-violet-500"),
              event.on_click({ msg.StreamAlbum(album, 0) }),
            ]),
          ]),
          html.div([], []),
          // html.i(
        //   [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
        //   [],
        // ),
        ]
          |> list.reverse,
      )
  }
}
