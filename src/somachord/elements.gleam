import gleam/bool
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/string
import gleam/uri
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import player
import somachord/api/api
import somachord/elements/button

import somachord/components
import somachord/model
import somachord/msg
import somachord/storage
import varasto
import vibrant

import somachord/api/models as api_models

pub const scrollbar_class = "[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"

pub fn song(
  song song: api_models.Child,
  attrs attrs: List(attribute.Attribute(msg)),
  cover_art cover_art: Bool,
  msg msg: msg,
  // like_msg like_msg: msg,
) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  let layout = components.layout()

  html.div(
    [
      case layout {
        model.Mobile ->
          attribute.class("duration-50 transition-all active:scale-[98%]")
        model.Desktop -> attribute.none()
      },
      // Song Index styling
      attribute.class(
        "before:-mr-4 before:content-[attr(data-index)] before:w-2 before:text-zinc-600 before:font-[Azeret_Mono] before:font-light before:text-sm before:text-right before:self-center hover:before:invisible data-playing:before:invisible",
      ),
      // For the element itself
      attribute.class(
        "group [.has-dynamic-color]:hover:bg-(--dynamic-color)/35! hover:bg-zinc-800 rounded-md p-2 -mt-3 flex gap-2",
      ),
      event.on("dblclick", { decode.success(msg) }),
      case layout {
        model.Mobile -> event.on_click(msg)
        model.Desktop -> attribute.none()
      },
      ..attrs
    ],
    [
      html.div([attribute.class("flex flex-grow gap-4 items-center")], [
        html.div(
          [
            attribute.class(
              "group-data-[index=-1]:hidden not-group-data-index:hidden w-5 grid grid-rows-1 grid-cols-1",
            ),
          ],
          [
            waveform([
              attribute.class(
                "group-hover:hidden not-group-data-playing:hidden col-start-1 row-start-1 group-[.has-dynamic-color]:fill-(--dynamic-color)! fill-violet-400",
              ),
            ]),
            html.i(
              [
                event.on_click(msg),
                attribute.class(
                  "text-sm col-start-1 row-start-1 ph-fill ph-play hidden group-hover:block",
                ),
              ],
              [],
            ),
          ],
        ),
        html.div([attribute.class("flex gap-2 items-center")], [
          case cover_art {
            True ->
              html.img([
                attribute.class("w-12 h-12 rounded-sm select-none"),
                attribute.src(api.cover_url(
                  auth_details,
                  song.cover_art_id,
                  500,
                )),
              ])
            False -> element.none()
          },
          html.div([attribute.class("flex flex-col gap-0.5 justify-center")], [
            case
              layout,
              html.span(
                [
                  attribute.class(
                    "group-[.has-dynamic-color]:group-data-playing:text-(--dynamic-color)! text-violet-400 not-group-data-playing:text-zinc-100 select-none text-wrap text-sm hover:underline",
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
              [attribute.class("select-none text-sm text-zinc-500 font-light")],
              list.map(song.artists, fn(artist: api_models.SmallArtist) {
                let elem =
                  html.span([attribute.class("text-zinc-400 hover:underline")], [
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
              "font-[Azeret_Mono] select-none font-light text-zinc-500 text-sm",
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
          // button.button(button.Like(filled: False), button.Medium, [
        //   case False {
        //     True -> attribute.class("text-violet-500")
        //     False -> attribute.none()
        //   },
        //   event.on_click(like_msg),
        // ]),
        // html.i(
        //   [
        //     attribute.class(
        //       "text-zinc-500 text-2xl ph ph-dots-three-vertical",
        //     ),
        //   ],
        //   [],
        // ),
        ]),
      ]),
    ],
  )
}

pub fn waveform(attrs: List(attribute.Attribute(a))) {
  element.unsafe_raw_html(
    "",
    "waveform",
    attrs,
    "
<svg width='32' height='32' viewBox='0 0 120 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='20' y='90' width='5' height='0'>
    <animate attributeName='height' values='0; 60; 10; 40; 0' dur='1.2s' repeatCount='indefinite' keyTimes='0; 0.3; 0.6; 0.8; 1'></animate>
    <animate attributeName='y' values='90; 30; 80; 50; 90' dur='1.2s' repeatCount='indefinite' keyTimes='0; 0.3; 0.6; 0.8; 1'></animate>
  </rect>

  <rect x='40' y='90' width='5' height='0'>
    <animate attributeName='height' values='0; 45; 20; 70; 0' dur='1.3s' repeatCount='indefinite' keyTimes='0; 0.2; 0.5; 0.85; 1'></animate>
    <animate attributeName='y' values='90; 45; 70; 20; 90' dur='1.3s' repeatCount='indefinite' keyTimes='0; 0.2; 0.5; 0.85; 1'></animate>
  </rect>

  <rect x='60' y='90' width='5' height='0'>
    <animate attributeName='height' values='0; 70; 30; 50; 0' dur='1.1s' repeatCount='indefinite' keyTimes='0; 0.4; 0.7; 0.9; 1'></animate>
    <animate attributeName='y' values='90; 20; 60; 40; 90' dur='1.1s' repeatCount='indefinite' keyTimes='0; 0.4; 0.7; 0.9; 1'></animate>
  </rect>
</svg>
    ",
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
              attribute.src(api.cover_url(auth_details, album.cover_art_id, 500)),
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
      html.span([attribute.class("inline-flex flex-col gap-1")], [
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
        artists(album.artists, []),
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
                  attribute.src(api.cover_url(auth_details, cover_art_id, 500)),
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

pub fn nav_button(inactive, active, name, is_active, attrs) {
  html.div(
    [
      attribute.class(
        "w-52 font-normal flex gap-2 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg",
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

pub fn music_slider(
  m: model.Model,
  dynamic: Bool,
  attrs: List(attribute.Attribute(msg.Msg)),
) {
  html.div([attribute.class("grid grid-cols-1 grid-rows-1"), ..attrs], [
    html.div(
      [
        attribute.class("col-start-1 row-start-1 rounded-full h-1.5"),
        case dynamic, m.current_palette.empty {
          True, False ->
            attribute.style(
              "background-color",
              m.current_palette |> vibrant.muted |> vibrant.hex,
            )
          _, _ -> attribute.class("bg-zinc-800")
        },
      ],
      [
        html.div(
          [
            attribute.class(
              "bg-zinc-100 transition-[width] duration-100 rounded-full h-1.5",
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
      attribute.step("any"),
      attribute.max(int.to_string(m.current_song.duration)),
      event.on("input", {
        use value <- decode.subfield(["target", "value"], decode.string)
        let assert Ok(seek_amount) = float.parse(value)
        decode.success(msg.PlayerSeek(seek_amount))
      }),
      event.on("mousedown", {
        use btn <- decode.field("button", decode.int)
        use <- bool.guard(btn != 0, decode.success(msg.ComponentClick))
        m.player |> player.toggle_play()

        decode.success(msg.ComponentClick)
      }),
      event.on("mouseup", {
        use btn <- decode.field("button", decode.int)
        use <- bool.guard(btn != 0, decode.success(msg.ComponentClick))
        m.player |> player.toggle_play()

        decode.success(msg.ComponentClick)
      }),
      attribute.type_("range"),
    ]),
  ])
}

pub fn artists(
  artists: List(api_models.SmallArtist),
  attrs: List(attribute.Attribute(a)),
) {
  html.span(
    [
      attribute.class(
        "text-zinc-400 font-light text-sm overflow-hidden text-nowrap text-ellipsis min-w-0",
      ),
      ..attrs
    ],
    list.map(artists, fn(artist: api_models.SmallArtist) {
      html.a(
        [
          attribute.href("/artist/" <> artist.id),
        ],
        [
          html.span(
            [
              attribute.class("hover:underline"),
            ],
            [element.text(artist.name)],
          ),
        ],
      )
    })
      |> list.intersperse(element.text(", ")),
  )
}
