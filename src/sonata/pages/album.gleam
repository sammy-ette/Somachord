import gleam/list
import gleroglero/outline
import gleroglero/solid
import lustre/attribute
import lustre/element
import lustre/element/html
import sonata/elements
import sonata/model

pub fn page(m: model.Model) {
  case m.layout {
    model.Mobile -> page_mobile()
    model.Desktop -> desktop_page()
  }
}

const to_x_song_names = [
  "To X.", "Melt Away", "Burn It Down", "Nightmare", "All For Nothing",
  "Fabulous",
]

pub fn desktop_page() {
  html.div(
    [
      attribute.class(
        "flex-1 flex gap-4 p-8 rounded-md border border-zinc-800 overflow-hidden",
      ),
    ],
    [
      html.div(
        [
          attribute.class(
            "flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
          ),
        ],
        [
          html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
            element.text("To X."),
          ]),
          html.div(
            [attribute.class("flex gap-3 text-xs text-zinc-400 items-center")],
            [
              html.span([attribute.class("flex gap-2")], [
                html.div([attribute.class("w-4 h-4")], [outline.user()]),
                html.span([attribute.class("text-zinc-300")], [
                  element.text("TAEYEON"),
                ]),
              ]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("2023")]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("6 songs")]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("17 min, 55 sec")]),
            ],
          ),
          html.div(
            [attribute.class("text-zinc-400 flex gap-4 items-center -ml-1")],
            [
              html.div([attribute.class("h-10 w-10 text-[#8571ee]")], [
                solid.play_circle(),
              ]),
              html.div([attribute.class("h-8 w-8")], [
                outline.arrows_right_left(),
              ]),
              html.div([attribute.class("h-8 w-8")], [outline.plus_circle()]),
              html.div([attribute.class("h-8 w-8")], [outline.arrow_down_tray()]),
              html.div([attribute.class("h-8 w-8")], [outline.link()]),
              html.div([attribute.class("h-8 w-8")], [
                outline.ellipsis_horizontal(),
              ]),
            ],
          ),
          html.div(
            [attribute.class("flex flex-col gap-4")],
            list.index_map(to_x_song_names, fn(title: String, index: Int) {
              elements.song(
                model.Song(
                  id: "",
                  title:,
                  album: "To X.",
                  artist: "TAEYEON",
                  duration: 0,
                ),
                index:,
                attrs: [],
              )
            })
              |> list.repeat(2)
              |> list.flatten,
          ),
        ],
      ),
      html.div([attribute.class("flex flex-col gap-8")], [
        html.img([
          attribute.src(
            "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg",
          ),
          attribute.class("max-w-80 max-h-80 object-scale rounded-md"),
        ]),
        html.div([attribute.class("flex flex-wrap gap-4")], [
          elements.tag("K-Pop"),
          elements.tag("R&B"),
        ]),
      ]),
    ],
  )
}

pub fn page_mobile() {
  html.div([attribute.class("flex justify-center flex-col py-4 p-12 gap-6")], [
    html.img([
      attribute.src(
        "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg",
      ),
      attribute.class("self-center w-72 h-72 object-scale h-fit rounded-md"),
    ]),
    html.div([attribute.class("flex justify-between items-center")], [
      html.div([attribute.class("flex flex-col gap-4")], [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text("To X."),
        ]),
        html.span([attribute.class("flex gap-2 items-center")], [
          html.div([attribute.class("w-4 h-4")], [outline.user()]),
          html.span([attribute.class("text-zinc-300")], [
            element.text("TAEYEON"),
          ]),
        ]),
      ]),
      html.div([attribute.class("flex gap-2 text-zinc-500")], [
        html.div([attribute.class("h-12 w-12")], [solid.ellipsis_horizontal()]),
        html.div([attribute.class("h-12 w-12 text-[#8571ee]")], [
          solid.play_circle(),
        ]),
      ]),
    ]),
    html.div(
      [attribute.class("flex flex-col gap-4")],
      list.index_map(to_x_song_names, fn(title: String, index: Int) {
        elements.song(
          model.Song(
            id: "",
            title:,
            album: "To X.",
            artist: "TAEYEON",
            duration: 0,
          ),
          index:,
          attrs: [],
        )
      })
        |> list.repeat(2)
        |> list.flatten,
    ),
  ])
}
