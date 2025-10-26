import gleam/dynamic/decode
import gleam/int
import gleam/list
import gleam/string
import gleam/uri
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api_helper
import somachord/components
import somachord/model
import somachord/storage
import varasto

import somachord/api_models

pub const scrollbar_class = "[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"

pub fn song(
  song song: api_models.Child,
  index index: Int,
  attrs attrs: List(attribute.Attribute(msg)),
  cover_art cover_art: Bool,
  msg msg: msg,
) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  let layout = components.layout()

  html.div(
    [
      attribute.class(
        "group hover:bg-zinc-800 rounded-md p-2 -mt-3 flex justify-between gap-2",
      ),
      event.on("dblclick", { decode.success(msg) }),
      ..attrs
    ],
    [
      html.div([attribute.class("flex gap-4 items-center")], [
        case index {
          -1 -> element.none()
          _ ->
            html.div([attribute.class("w-5 grid grid-rows-1 grid-cols-1")], [
              html.span(
                [
                  attribute.class(
                    "col-start-1 row-start-1 group-hover:hidden text-zinc-600 font-[Azeret_Mono] font-light text-smtext-right",
                  ),
                ],
                [element.text(int.to_string(index + 1))],
              ),
              html.i(
                [
                  event.on_click(msg),
                  attribute.class(
                    "text-sm col-start-1 row-start-1 ph-fill ph-play hidden group-hover:block",
                  ),
                ],
                [],
              ),
            ])
        },
        html.div([attribute.class("flex gap-2 items-center")], [
          case cover_art {
            True ->
              html.img([
                attribute.class("w-12 h-12 rounded-sm"),
                attribute.src(
                  api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
                    #("id", song.cover_art_id),
                    #("size", "500"),
                  ])
                  |> uri.to_string,
                ),
              ])
            False -> element.none()
          },
          html.div([attribute.class("flex flex-col gap-0.5 justify-center")], [
            case
              layout,
              html.span(
                [
                  attribute.class(
                    "text-wrap text-sm text-zinc-100 hover:underline",
                  ),
                ],
                [element.text(song.title)],
              )
            {
              model.Desktop, elem ->
                html.a([attribute.href("/song/" <> song.id)], [elem])
              model.Mobile, elem -> elem
            },
            html.span(
              [attribute.class("text-sm text-zinc-500 font-light")],
              list.map(song.artists, fn(artist: api_models.SmallArtist) {
                let elem =
                  html.span([attribute.class("text-zinc-300 hover:underline")], [
                    element.text(artist.name),
                  ])
                case layout {
                  model.Desktop ->
                    html.a([attribute.href("/artist/" <> artist.id)], [elem])
                  model.Mobile -> elem
                }
              })
                |> list.intersperse(element.text(", ")),
            ),
          ]),
        ]),
      ]),
      html.div([attribute.class("flex gap-4 items-center")], [
        html.span(
          [
            attribute.class(
              "font-[Azeret_Mono] font-light text-zinc-500 text-sm",
            ),
          ],
          [
            element.text({
              let minutes = song.duration / 60
              let seconds = song.duration % 60

              int.to_string(minutes)
              <> ":"
              <> int.to_string(seconds) |> string.pad_start(2, "0")
            }),
          ],
        ),
        html.div([attribute.class("flex items-center")], [
          html.i(
            [attribute.class("text-zinc-500 text-2xl ph ph-heart-straight")],
            [],
          ),
          html.i(
            [
              attribute.class(
                "text-zinc-500 text-2xl ph ph-dots-three-vertical",
              ),
            ],
            [],
          ),
        ]),
      ]),
    ],
  )
}

pub fn album(album album: api_models.Album, handler handler: fn(String) -> msg) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "flex flex-col flex-none w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75",
      ),
      event.on("dblclick", { decode.success(handler(album.id)) }),
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
          html.a([attribute.href("/album/" <> album.id)], [
            html.img([
              attribute.src(
                api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
                  #("id", album.cover_art_id),
                  #("size", "500"),
                ])
                |> uri.to_string,
              ),
              attribute.class(
                "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute",
              ),
            ]),
          ]),
          html.div(
            [
              event.on_click(handler(album.id)),
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
        ],
      ),
      html.span([attribute.class("inline-flex flex-col")], [
        html.a(
          [attribute.href("/album/" <> album.id), attribute.class("space-x-1")],
          [
            html.span([attribute.class("text-zinc-100 hover:underline")], [
              element.text(album.name),
            ]),
            // case album.year {
          //   0 -> element.none()
          //   year ->
          //     html.span(
          //       [attribute.class("text-zinc-500 font-light text-[0.6rem]")],
          //       [
          //         element.text(int.to_string(year)),
          //       ],
          //     )
          // },
          ],
        ),
        html.span(
          [],
          list.map(album.artists, fn(artist: api_models.SmallArtist) {
            html.a([attribute.href("/artist/" <> artist.id)], [
              html.span(
                [
                  attribute.class(
                    "hover:underline font-light text-sm text-zinc-400",
                  ),
                ],
                [element.text(artist.name)],
              ),
            ])
          })
            |> list.intersperse(element.text(", ")),
        ),
      ]),
    ],
  )
}

pub fn playlist(
  playlist playlist: api_models.Playlist,
  handler handler: fn(String) -> msg,
) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "flex flex-col flex-none w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75",
      ),
      event.on("dblclick", { decode.success(handler(playlist.id)) }),
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
          html.a([attribute.href("/playlist/" <> playlist.id)], [
            case
              playlist.cover_art_id,
              attribute.class(
                "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute",
              )
            {
              "", classes ->
                html.div(
                  [
                    classes,
                    attribute.class(
                      "bg-zinc-900 justify-center items-center flex w-full h-fit aspect-square",
                    ),
                  ],
                  [
                    html.i(
                      [
                        attribute.class(
                          "text-zinc-500 text-3xl ph ph-music-notes-simple",
                        ),
                      ],
                      [],
                    ),
                  ],
                )
              cover_art_id, classes ->
                html.img([
                  attribute.src(
                    api_helper.create_uri(
                      "/rest/getCoverArt.view",
                      auth_details,
                      [
                        #("id", cover_art_id),
                        #("size", "500"),
                      ],
                    )
                    |> uri.to_string,
                  ),
                  classes,
                ])
            },
          ]),
          html.div(
            [
              event.on_click(handler(playlist.id)),
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
        ],
      ),
      html.span([attribute.class("inline-flex flex-col")], [
        html.a(
          [
            attribute.href("/playlist/" <> playlist.id),
            attribute.class("space-x-1"),
          ],
          [
            html.span([attribute.class("text-zinc-100 hover:underline")], [
              element.text(playlist.name),
            ]),
          ],
        ),
        html.span([attribute.class("text-zinc-500 font-light text-sm")], [
          element.text(
            int.to_string(playlist.song_count)
            <> " song"
            <> case playlist.song_count == 1 {
              False -> "s"
              True -> ""
            },
          ),
        ]),
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

pub fn time(duration: Int, attrs: List(attribute.Attribute(a))) {
  html.span(attrs, [
    element.text({
      let minutes = duration / 60
      let seconds = duration % 60

      int.to_string(minutes)
      <> ":"
      <> int.to_string(seconds) |> string.pad_start(2, "0")
    }),
  ])
}

pub fn button(icon, name, attrs) {
  html.div(
    [
      attribute.class(
        "w-52 font-semibold text-zinc-500 font-normal flex gap-2 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg",
      ),
      ..attrs
    ],
    [
      html.div([attribute.class("h-8 w-8")], [icon]),
      html.h1([], [element.text(name)]),
    ],
  )
}

pub fn nav_button(inactive, active, name, is_active, attrs) {
  html.div(
    [
      attribute.class(
        "w-52 font-normal flex gap-4 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg",
      ),
      case is_active {
        True -> attribute.class("bg-zinc-900 text-zinc-100")
        False -> attribute.class("font-semibold text-zinc-500")
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
