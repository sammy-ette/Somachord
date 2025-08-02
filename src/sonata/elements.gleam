import gleam/int
import gleroglero/outline
import gleroglero/solid
import lustre/attribute
import lustre/element
import lustre/element/html

import sonata/model

pub fn song(
  song song: model.Song,
  index index: Int,
  attrs attrs: List(attribute.Attribute(msg)),
) {
  html.div([attribute.class("flex justify-between"), ..attrs], [
    html.div([attribute.class("flex gap-4 items-center")], [
      html.span(
        [attribute.class("text-zinc-600 font-[Azeret_Mono] font-light text-sm")],
        [element.text(int.to_string(index + 1))],
      ),
      html.div([attribute.class("flex gap-2 items-center")], [
        html.div([attribute.class("w-8 h-8 text-zinc-400")], [
          solid.musical_note(),
        ]),
        html.div([attribute.class("flex flex-col gap")], [
          html.a([attribute.href("/song/" <> song.id)], [
            html.span(
              [attribute.class("text-sm text-zinc-100 hover:underline")],
              [element.text(song.title)],
            ),
          ]),
          html.span([attribute.class("text-sm text-zinc-500 font-light")], [
            element.text(song.artist),
          ]),
        ]),
      ]),
    ]),
    html.div([attribute.class("flex gap-4 items-center")], [
      html.span(
        [attribute.class("font-[Azeret_Mono] font-light text-zinc-500 text-sm")],
        [element.text("0:00")],
      ),
      html.div([attribute.class("h-6 w-6 text-zinc-500")], [outline.heart()]),
      html.div([attribute.class("h-6 w-6 text-zinc-500")], [
        outline.ellipsis_vertical(),
      ]),
    ]),
  ])
}

pub fn album(album album: model.Album) {
  html.div(
    [
      attribute.class(
        "flex flex-col w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75",
      ),
    ],
    [
      html.div(
        [
          attribute.class("relative mt-4 h-42"),
          attribute.style("clip-path", "inset(0 0 0 0);"),
        ],
        [
          html.div(
            [
              attribute.class(
                "w-34 h-28 -mt-2 mx-2 bg-zinc-700 rounded-md absolute",
              ),
            ],
            [],
          ),
          html.img([
            attribute.src(
              "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg",
            ),
            attribute.class(
              "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute",
            ),
          ]),
          html.div(
            [
              attribute.class(
                "absolute top-26 left-26 relative transition duration-250 ease-out translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
              ),
            ],
            [
              html.div([attribute.class("rounded-full bg-black w-8 h-8")], []),
              html.i(
                [
                  attribute.class(
                    "absolute -top-2 -left-2 ph-fill ph-play-circle text-5xl text-violet-500",
                  ),
                ],
                [],
              ),
            ],
          ),
          // html.div(
        //   [
        //     attribute.class(
        //       "h-12 w-12 rounded-full bg-[#8571ee] p-2 absolute top-24 left-24 transition duration-250 ease-out translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
        //     ),
        //   ],
        //   [solid.play()],
        // ),
        ],
      ),
      html.span([attribute.class("text-zinc-100")], [element.text(album.name)]),
      html.span([attribute.class("text-zinc-500 font-light text-xs")], [
        element.text(int.to_string(album.year)),
      ]),
    ],
  )
}

pub fn tag(name: String) {
  html.div([attribute.class("rounded-full border border-zinc-400 py-2 px-6")], [
    html.span([attribute.class("text-zinc-400 text-light text-xs")], [
      element.text(name),
    ]),
  ])
}
