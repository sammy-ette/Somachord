import gleroglero/outline
import gleroglero/solid
import lustre/attribute
import lustre/element
import lustre/element/html

import sonata/components/song_detail
import sonata/elements

pub fn page() {
  html.div(
    [
      attribute.class(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
      ),
    ],
    [
      html.div([attribute.class("flex gap-8 p-8")], [
        html.img([
          attribute.src(
            "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg",
          ),
          attribute.class("w-80 h-80 object-cover rounded-md"),
        ]),
        html.div([attribute.class("flex flex-col gap-4")], [
          html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
            element.text("Fabulous"),
          ]),
          html.div(
            [attribute.class("flex gap-3 text-xs text-zinc-400 items-center")],
            [
              html.span([attribute.class("flex gap-2 items-center")], [
                html.i([attribute.class("text-xl ph ph-user-sound")], []),
                html.span([attribute.class("text-zinc-300")], [
                  element.text("TAEYEON"),
                ]),
              ]),
              html.span([], [element.text("•")]),
              html.span([attribute.class("flex gap-2 items-center")], [
                html.i([attribute.class("text-xl ph ph-vinyl-record")], []),
                html.span([attribute.class("text-zinc-300")], [
                  element.text("To X."),
                ]),
              ]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("2023")]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("2:51")]),
              html.span([], [element.text("•")]),
              html.span([], [element.text("69,727,420")]),
            ],
          ),
          html.div(
            [attribute.class("text-zinc-400 flex gap-4 items-center -ml-1")],
            [
              html.i(
                [
                  attribute.class(
                    "text-4xl text-violet-500 ph-fill ph-play-circle",
                  ),
                ],
                [],
              ),
              html.i([attribute.class("text-2xl ph ph-plus-circle")], []),
              html.i([attribute.class("text-2xl ph ph-download-simple")], []),
              html.i([attribute.class("text-2xl ph ph-link")], []),
              html.i([attribute.class("text-2xl ph ph-dots-three")], []),
            ],
          ),
          html.div([attribute.class("flex flex-wrap gap-4")], [
            elements.tag("K-Pop"),
            elements.tag("R&B"),
          ]),
        ]),
      ]),
      song_detail.element([]),
    ],
  )
}
