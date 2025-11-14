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
import somachord/components
import somachord/components/lyrics
import somachord/elements
import somachord/model
import somachord/msg
import somachord/queue
import varasto

pub fn view(m: model.Model) {
  html.div(
    [
      attribute.class(
        "z-100 fixed bottom-0 left-0 transition duration-300 min-w-0 min-h-0 w-full h-full",
      ),
      case m.fullscreen_player_open {
        True -> attribute.class("translate-y-0")
        False -> attribute.class("translate-y-full")
      },
    ],
    [
      case components.layout() {
        model.Desktop -> view_desktop(m)
        model.Mobile -> view_mobile(m)
      },
    ],
  )
}

fn view_desktop(m: model.Model) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "bg-zinc-950 border-t border-zinc-800 flex flex-col gap-8 min-w-0 min-h-0 w-full h-full p-8",
      ),
    ],
    [
      html.div([attribute.class("flex gap-8")], [
        html.i(
          [
            attribute.class("text-3xl ph ph-caret-down"),
            event.on_click(msg.ToggleFullscreenPlayer),
          ],
          [],
        ),
        // TV Mode (just an alternate layout, chromecast-y)
        html.i(
          [
            attribute.class("text-3xl ph ph-television-simple"),
          ],
          [],
        ),
      ]),
      html.div([attribute.class("overflow-hidden flex-1 flex gap-8")], [
        html.div(
          [
            attribute.class(
              "w-1/2 flex flex-col items-center justify-center gap-8",
            ),
          ],
          [
            html.img([
              attribute.src(
                api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
                  #("id", m.current_song.cover_art_id),
                  #("size", "500"),
                ])
                |> uri.to_string,
              ),
              attribute.class(
                "max-w-120 max-h-120 self-center object-fit rounded-md",
              ),
            ]),
            html.div([attribute.class("w-full")], [
              html.div([attribute.class("flex justify-between min-w-0")], [
                html.a(
                  [
                    attribute.href("/song/" <> m.current_song.id),
                    event.on_click(msg.ToggleFullscreenPlayer),
                    attribute.class(
                      "overflow-hidden text-nowrap text-ellipsis min-w-0",
                    ),
                  ],
                  [
                    html.span(
                      [attribute.class("hover:underline font-bold text-2xl")],
                      [
                        element.text(m.current_song.title),
                      ],
                    ),
                  ],
                ),
                html.div([attribute.class("flex gap-2")], [
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
              ]),
              html.span(
                [
                  attribute.class(
                    "text-zinc-400 font-light text-sm overflow-hidden text-nowrap text-ellipsis min-w-0",
                  ),
                ],
                list.map(
                  m.current_song.artists,
                  fn(artist: api_models.SmallArtist) {
                    html.a(
                      [
                        attribute.href("/artist/" <> artist.id),
                        event.on_click(msg.ToggleFullscreenPlayer),
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
                  },
                )
                  |> list.intersperse(element.text(", ")),
              ),
            ]),
            html.div([attribute.class("space-y-1 w-full")], [
              html.div(
                [
                  attribute.class(
                    "flex gap-2 items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]",
                  ),
                ],
                [
                  html.span([], [
                    element.text({
                      let minutes =
                        float.round({ m.player |> player.time() }) / 60
                      let seconds =
                        float.round({ m.player |> player.time() }) % 60

                      int.to_string(minutes)
                      <> ":"
                      <> int.to_string(seconds) |> string.pad_start(2, "0")
                    }),
                  ]),
                  elements.music_slider(m, [attribute.class("w-full")]),
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
              html.div(
                [attribute.class("flex gap-4 justify-center items-center")],
                [
                  html.i(
                    [
                      attribute.class("text-2xl ph ph-shuffle-simple"),
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
                      attribute.class("text-2xl ph-fill ph-skip-back"),
                      event.on_click(msg.PlayerPrevious),
                    ],
                    [],
                  ),
                  html.i(
                    [
                      attribute.class("text-5xl ph-fill"),
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
                      attribute.class("text-2xl ph-fill ph-skip-forward"),
                      event.on_click(msg.PlayerNext),
                    ],
                    [],
                  ),
                  html.i(
                    [
                      attribute.class("text-2xl ph ph-repeat-once"),
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
                ],
              ),
            ]),
          ],
        ),
        html.div([attribute.class("w-1/2 flex flex-col")], [
          html.div(
            [
              attribute.class(
                "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 bg-zinc-950 mb-2",
              ),
            ],
            [
              tab_element(m, model.Default),
              tab_element(m, model.Lyrics),
            ],
          ),
          case m.fullscreen_player_display {
            model.Default ->
              html.div(
                [
                  attribute.class("overflow-y-auto"),
                  attribute.class(elements.scrollbar_class),
                  attribute.class("flex flex-col gap-2 pt-2"),
                ],
                list.map(queue.list(m.queue), fn(queue_entry) {
                  elements.song(
                    queue_entry.1,
                    queue_entry.0,
                    [],
                    cover_art: True,
                    playing: m.current_song.id == { queue_entry.1 }.id,
                    msg: { msg.QueueJumpTo(queue_entry.0) },
                  )
                }),
              )
            model.Lyrics ->
              lyrics.element([
                attribute.class("overflow-y-auto"),
                attribute.class(elements.scrollbar_class),
                lyrics.id(m.current_song.id),
                lyrics.song_time(m.player |> player.time()),
                lyrics.size(lyrics.Large),
                case m.fullscreen_player_open {
                  True -> lyrics.auto_scroll(True)
                  False -> lyrics.auto_scroll(False)
                },
              ])
          },
        ]),
      ]),
    ],
  )
}

fn tab_as_string(tab: model.FullscreenPlayerDisplay) {
  case tab {
    model.Default -> "Queue"
    model.Lyrics -> "Lyrics"
  }
}

fn tab_element(m: model.Model, tab: model.FullscreenPlayerDisplay) {
  html.span(
    [
      event.on_click(msg.ChangeFullscreenPlayerView(tab)),
      attribute.class("relative cursor-pointer"),
      case tab == m.fullscreen_player_display {
        True -> attribute.class("text-zinc-100")
        False -> attribute.class("text-zinc-500 hover:text-zinc-300")
      },
    ],
    [
      element.text(tab_as_string(tab)),
      case tab == m.fullscreen_player_display {
        True ->
          html.div(
            [
              attribute.class(
                "absolute top-9.25 w-full h-1 border-b border-violet-500",
              ),
            ],
            [],
          )
        False -> element.none()
      },
    ],
  )
}

fn view_mobile(m: model.Model) {
  html.div(
    [
      attribute.class(
        "bg-zinc-900 w-full h-full flex flex-col [@media(max-height:700px)]:gap-2 gap-8 px-8 [@media(max-height:700px)]:py-4 py-16",
      ),
    ],
    [
      html.div(
        [
          attribute.class(
            "flex items-center justify-between text-zinc-300 gap-4 min-w-0",
          ),
        ],
        [
          html.i(
            [
              attribute.class("text-3xl ph ph-caret-down"),
              event.on_click(msg.ToggleFullscreenPlayer),
            ],
            [],
          ),
          case m.fullscreen_player_display {
            model.Default -> element.none()
            model.Lyrics ->
              html.span(
                [
                  attribute.class(
                    "self-center inline-flex items-center text-sm overflow-hidden text-nowrap text-ellipsis min-w-0",
                  ),
                ],
                [
                  elements.waveform([attribute.class("fill-violet-500")]),
                  element.text(m.current_song.title),
                ],
              )
          },
        ],
      ),
      // Main Content
      // Can either be:
      // 1. Lyrics
      // 2. Album Art + Song Info
      html.div(
        [
          attribute.class("flex-1 flex flex-col gap-4"),
          case m.fullscreen_player_display {
            model.Lyrics -> attribute.class("overflow-y-auto")
            _ -> attribute.none()
          },
        ],
        case m.fullscreen_player_display {
          model.Default -> view_info(m)
          model.Lyrics -> [
            lyrics.element([
              lyrics.id(m.current_song.id),
              lyrics.song_time(m.player |> player.time()),
              case m.fullscreen_player_open {
                True -> lyrics.auto_scroll(True)
                False -> lyrics.auto_scroll(False)
              },
            ]),
          ]
        },
      ),
      // Main player UI (slider, skip buttons, blah blah)
      html.div([], [
        html.div([attribute.class("space-y-2")], [
          elements.music_slider(m, [attribute.class("w-full")]),
          html.div(
            [
              attribute.class(
                "flex justify-between items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]",
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
        html.div([attribute.class("flex gap-4 justify-between items-center")], [
          html.i(
            [
              attribute.class("text-2xl ph ph-shuffle-simple"),
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
              attribute.class("text-2xl ph-fill ph-skip-back"),
              event.on_click(msg.PlayerPrevious),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-6xl ph-fill"),
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
              attribute.class("text-2xl ph-fill ph-skip-forward"),
              event.on_click(msg.PlayerNext),
            ],
            [],
          ),
          html.i(
            [
              attribute.class("text-2xl ph ph-repeat-once"),
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
      ]),
      // Other actions
      html.div([attribute.class("flex gap-4 justify-evenly items-center")], [
        html.i(
          [
            attribute.class("text-3xl ph ph-music-notes py-2 px-4"),
            event.on_click(msg.ChangeFullscreenPlayerView(model.Default)),
            case m.fullscreen_player_display {
              model.Default -> attribute.class("bg-zinc-800 rounded-md")
              _ -> attribute.none()
            },
          ],
          [],
        ),
        html.i(
          [
            attribute.class("text-3xl ph ph-microphone-stage py-2 px-4"),
            event.on_click(msg.ChangeFullscreenPlayerView(model.Lyrics)),
            case m.fullscreen_player_display {
              model.Lyrics -> attribute.class("bg-zinc-800 rounded-md")
              _ -> attribute.none()
            },
          ],
          [],
        ),
        html.i([attribute.class("text-3xl ph ph-queue py-2 px-4")], []),
      ]),
    ],
  )
}

fn view_info(m: model.Model) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }

  [
    html.div(
      [attribute.class("flex-1 space-y-4 flex flex-col justify-center")],
      [
        html.img([
          attribute.src(
            api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
              #("id", m.current_song.cover_art_id),
              #("size", "500"),
            ])
            |> uri.to_string,
          ),
          attribute.class("self-center object-scale rounded-md"),
        ]),
      ],
    ),
    html.div([], [
      html.div([attribute.class("flex justify-between min-w-0")], [
        html.a(
          [
            attribute.href("/song/" <> m.current_song.id),
            event.on_click(msg.ToggleFullscreenPlayer),
            attribute.class("overflow-hidden text-nowrap text-ellipsis min-w-0"),
          ],
          [
            html.span([attribute.class("hover:underline font-medium text-xl")], [
              element.text(m.current_song.title),
            ]),
          ],
        ),
        html.div([attribute.class("flex gap-2")], [
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
      ]),
      html.span(
        [
          attribute.class(
            "text-zinc-300 font-normal text-sm overflow-hidden text-nowrap text-ellipsis min-w-0",
          ),
        ],
        list.map(m.current_song.artists, fn(artist: api_models.SmallArtist) {
          html.a(
            [
              attribute.href("/artist/" <> artist.id),
              event.on_click(msg.ToggleFullscreenPlayer),
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
      ),
    ]),
  ]
}
