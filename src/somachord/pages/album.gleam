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
import somachord/elements
import somachord/model
import somachord/msg
import somachord/storage
import varasto

pub fn page(m: model.Model, id: String) {
  case m.layout {
    model.Mobile -> element.none()
    model.Desktop ->
      html.div(
        [
          attribute.class(
            "flex-1 flex gap-4 p-8 rounded-md border border-zinc-800 overflow-hidden",
          ),
        ],
        desktop_page(m, id) |> result.unwrap_both,
      )
  }
}

pub fn desktop_page(m: model.Model, id) {
  use album <- result.try(
    m.albums
    |> dict.get(id)
    |> result.replace_error([
      html.div(
        [
          attribute.class(
            "flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
          ),
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
        attribute.class(
          "flex-1 flex flex-col gap-6 overflow-y-auto pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
        ),
      ],
      [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(album.name),
        ]),
        html.div(
          [attribute.class("flex gap-3 text-xs text-zinc-400 items-center")],
          [
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-user-sound")], []),
              ..list.map(album.artists, fn(artist: api_models.SmallArtist) {
                html.a([attribute.href("/artist/" <> artist.id)], [
                  html.span([attribute.class("text-zinc-300 hover:underline")], [
                    element.text(artist.name),
                  ]),
                ])
              })
              |> list.intersperse(element.text(", "))
            ]),
            html.span([], [element.text("•")]),
            html.span([], [element.text(album.year |> int.to_string)]),
            html.span([], [element.text("•")]),
            html.span([], [
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
            html.span([], [
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
        html.div([attribute.class("text-zinc-400 flex gap-4 items-center")], [
          html.i(
            [
              attribute.class("text-5xl text-violet-500 ph-fill ph-play-circle"),
              event.on_click({ msg.StreamAlbum(album) }),
            ],
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
            [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
            [],
          ),
          html.i(
            [
              attribute.class(
                "text-3xl ph ph-download-simple cursor-not-allowed",
              ),
            ],
            [],
          ),
          html.i(
            [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
            [],
          ),
        ]),
        html.div(
          [attribute.class("flex flex-col gap-4")],
          list.index_map(album.songs, fn(song: api_models.Child, index: Int) {
            elements.song(song, index:, attrs: [], cover_art: False, msg: {
              msg.StreamSong(song)
            })
          }),
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
        attribute.class("max-w-80 max-h-80 object-scale rounded-md"),
      ]),
      html.div(
        [attribute.class("flex flex-wrap gap-4")],
        list.map(album.genres, elements.tag),
      ),
    ]),
  ])
}
