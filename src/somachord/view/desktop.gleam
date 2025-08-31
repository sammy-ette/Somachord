import gleam/bool
import gleam/dict
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
import somachord/api_helper
import somachord/api_models
import somachord/elements
import somachord/model
import somachord/msg
import somachord/queue
import somachord/router
import varasto

pub fn view(m: model.Model, page) {
  html.div(
    [
      attribute.class(
        "font-['Poppins'] w-full flex flex-col px-3 py-4 gap-2 overflow-hidden",
      ),
    ],
    [
      top_bar(m),
      html.div([attribute.class("flex gap-2 min-w-0 min-h-0 w-full h-full")], [
        //side_bar(m),
        html.div(
          [attribute.class("flex flex-col gap-2 min-w-0 min-h-0 w-full h-full")],
          [
            page,
            playing_bar(m),
          ],
        ),
      ]),
    ],
  )
}

pub fn view_(m: model.Model, page) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "font-['Poppins'] flex flex-col h-screen w-screen px-3 py-4 gap-2 overflow-auto",
      ),
    ],
    [
      top_bar(m),
      html.div([attribute.class("flex-1 min-h-0 flex gap-2")], [
        side_bar(m),
        html.div([attribute.class("flex-1 flex flex-col gap-2")], [
          page,
          playing_bar(m),
        ]),
      ]),
    ],
  )
}

fn top_bar(m: model.Model) {
  html.div([attribute.class("flex gap-4")], [
    elements.button(
      html.i([attribute.class("text-3xl ph ph-cards-three")], []),
      "Library",
      [attribute.class("w-42")],
    ),
    html.a([attribute.href("/")], [
      elements.nav_button(
        html.i([attribute.class("text-3xl ph ph-house")], []),
        html.i([attribute.class("text-3xl ph-fill ph-house")], []),
        "Home",
        m.route == router.Home,
        [attribute.class("w-42")],
      ),
    ]),
    elements.button(
      html.i([attribute.class("text-3xl ph ph-sparkle")], []),
      "Discover",
      [attribute.class("w-42")],
    ),
    case m.route {
      router.Search(query) ->
        html.div(
          [
            attribute.class(
              "bg-zinc-900 flex text-zinc-500 items-center px-4 py-2 rounded-lg font-normal gap-2",
            ),
          ],
          [
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            html.input([
              attribute.class("w-42 focus:outline outline:none outline:ring-0"),
              attribute.placeholder("Search"),
              attribute.value(query),
              attribute.autofocus(True),
              event.on_input(msg.Search),
            ]),
          ],
        )
      _ ->
        elements.button(
          html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
          "Search",
          [event.on_click({ msg.Search("") }), attribute.class("w-42")],
        )
    },
  ])
}

fn side_bar(_: model.Model) {
  html.div(
    [
      attribute.class(
        "flex flex-col gap-2 border border-zinc-800 rounded-lg py-4 px-1",
      ),
    ],
    [
      elements.button(
        html.i([attribute.class("text-3xl ph ph-playlist")], []),
        "Playlists",
        [],
      ),
      elements.button(
        html.i([attribute.class("text-3xl ph ph-heart-straight")], []),
        "Liked Songs",
        [],
      ),
      html.a([attribute.href("/albums")], [
        elements.button(
          html.i(
            [
              attribute.class("cursor-not-allowed text-3xl ph ph-vinyl-record"),
            ],
            [],
          ),
          "Albums",
          [],
        ),
      ]),
      html.a(
        [
          //attribute.href("/artists")
        ],
        [
          elements.button(
            html.i(
              [attribute.class("cursor-not-allowed text-3xl ph ph-user-sound")],
              [],
            ),
            "Artists",
            [],
          ),
        ],
      ),
    ],
  )
}

fn playing_bar(m: model.Model) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }
  html.div(
    [
      attribute.class(
        "h-20 rounded-lg p-4 border border-zinc-800 flex items-center justify-between",
      ),
    ],
    [
      html.div([attribute.class("flex gap-2 items-center w-1/3")], [
        html.div(
          [
            attribute.class(
              "w-14 h-14 bg-zinc-900 rounded-md flex items-center justify-center",
            ),
          ],
          [
            case m.current_song.cover_art_id == "" {
              True ->
                html.i(
                  [
                    attribute.class(
                      "text-zinc-500 text-3xl ph ph-music-notes-simple",
                    ),
                  ],
                  [],
                )
              False ->
                html.a([attribute.href("/album/" <> m.current_song.album_id)], [
                  html.img([
                    attribute.src(
                      api_helper.create_uri(
                        "/rest/getCoverArt.view",
                        auth_details,
                        [
                          #("id", m.current_song.cover_art_id),
                          #("size", "500"),
                        ],
                      )
                      |> uri.to_string,
                    ),
                    attribute.class(
                      "hover:opacity-50 transition-all duration-200 rounded-md object-cover",
                    ),
                  ]),
                ])
            },
          ],
        ),
        html.div([attribute.class("flex flex-col")], [
          html.a([attribute.href("/song/" <> m.current_song.id)], [
            html.span(
              [attribute.class("hover:underline font-normal text-nowrap")],
              [
                element.text(m.current_song.title),
              ],
            ),
          ]),
          html.span(
            [],
            list.map(m.current_song.artists, fn(artist: api_models.SmallArtist) {
              html.a([attribute.href("/artist/" <> artist.id)], [
                html.span(
                  [
                    attribute.class("hover:underline font-light text-sm"),
                  ],
                  [element.text(artist.name)],
                ),
              ])
            })
              |> list.intersperse(element.text(", ")),
          ),
        ]),
      ]),
      html.div([attribute.class("space-y-1")], [
        html.div([attribute.class("flex gap-4 justify-center items-center")], [
          html.i(
            [
              attribute.class("text-xl ph ph-shuffle-simple"),
              case m.shuffled {
                True ->
                  attribute.class(
                    "text-violet-400 underline underline-offset-4 decoration-dotted",
                  )
                False -> attribute.none()
              },
              event.on_click(msg.PlayerShuffle),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-xl ph-fill ph-skip-back"),
              event.on_click(msg.PlayerPrevious),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-4xl ph-fill"),
              case m.player |> player.is_paused {
                False -> attribute.class("ph-pause-circle")
                True -> attribute.class("ph-play-circle")
              },
              event.on_click(msg.PlayerPausePlay),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-xl ph-fill ph-skip-forward"),
              event.on_click(msg.PlayerNext),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-xl ph ph-repeat-once"),
              case m.looping {
                True ->
                  attribute.class(
                    "text-violet-400 underline underline-offset-4 decoration-dotted",
                  )
                False -> attribute.none()
              },
              event.on_click(msg.PlayerLoop),
            ],
            [],
          ),
        ]),
        html.div(
          [
            attribute.class(
              "flex gap-2 items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]",
            ),
          ],
          [
            html.span([], [
              element.text({
                let minutes = float.round({ m.player |> player.time() }) / 60
                let seconds = float.round({ m.player |> player.time() }) % 60

                int.to_string(minutes)
                <> ":"
                <> int.to_string(seconds) |> string.pad_start(2, "0")
              }),
            ]),
            html.div([attribute.class("grid grid-cols-1 grid-rows-1 w-96")], [
              html.div(
                [
                  attribute.class(
                    "col-start-1 row-start-1 bg-zinc-800 rounded-full h-1.5",
                  ),
                ],
                [
                  html.div(
                    [
                      attribute.class("bg-zinc-100 rounded-full h-1.5"),
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
                  use value <- decode.subfield(
                    ["target", "value"],
                    decode.string,
                  )
                  let assert Ok(seek_amount) = float.parse(value)
                  decode.success(msg.PlayerSeek(seek_amount))
                }),
                event.on("mousedown", {
                  use btn <- decode.field("button", decode.int)
                  use <- bool.guard(
                    btn != 0,
                    decode.success(msg.ComponentClick),
                  )
                  m.player |> player.toggle_play()

                  decode.success(msg.ComponentClick)
                }),
                event.on("mouseup", {
                  use btn <- decode.field("button", decode.int)
                  use <- bool.guard(
                    btn != 0,
                    decode.success(msg.ComponentClick),
                  )
                  m.player |> player.toggle_play()

                  decode.success(msg.ComponentClick)
                }),
                attribute.type_("range"),
              ]),
            ]),
            html.span([], [
              element.text({
                let minutes = m.current_song.duration / 60
                let seconds = m.current_song.duration % 60

                int.to_string(minutes)
                <> ":"
                <> int.to_string(seconds) |> string.pad_start(2, "0")
              }),
            ]),
          ],
        ),
      ]),
      html.div([attribute.class("flex justify-end gap-2 w-1/3")], [
        html.div([attribute.class("inline-flex relative")], [
          html.label([attribute.class("peer")], [
            html.input([
              attribute.type_("checkbox"),
              attribute.id("queue-toggle"),
              attribute.class("hidden"),
            ]),
            html.i([attribute.class("text-3xl ph ph-queue")], []),
          ]),
          html.div(
            [
              attribute.class(
                "not-peer-has-checked:hidden absolute flex flex-col gap-2 rounded-lg bg-zinc-900 w-96 h-80 -top-83 -left-69 p-4",
              ),
            ],
            [
              html.h1([attribute.class("font-semibold text-lg")], [
                element.text("Queue"),
              ]),
              html.div(
                [
                  attribute.class(
                    "flex flex-col gap-2 pt-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
                  ),
                ],
                list.map(queue.list(m.queue), fn(queue_entry) {
                  elements.song(queue_entry.1, -1, [], cover_art: True, msg: {
                    msg.QueueJumpTo(queue_entry.0)
                  })
                }),
              ),
            ],
          ),
        ]),
        html.i(
          [
            case m.current_song.starred {
              True -> attribute.class("ph-fill text-violet-500")
              False -> attribute.class("ph")
            },
            attribute.class("text-3xl ph-heart-straight"),
            event.on_click(msg.Like),
          ],
          [],
        ),
        html.i([attribute.class("text-3xl ph ph-plus-circle")], []),
      ]),
    ],
  )
}
