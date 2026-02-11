import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import gleam/string
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import player
import somachord/api/api
import somachord/api/models
import somachord/elements/button

import somachord/components/fullscreen_player
import somachord/components/playlist_menu
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
        "font-[Poppins,sans-serif] w-full flex flex-col px-3 py-4 gap-4 overflow-hidden",
      ),
    ],
    [
      top_bar(m),
      html.div([attribute.class("flex gap-2 min-w-0 min-h-0 w-full h-full")], [
        side_bar(m),
        html.div(
          [attribute.class("flex flex-col gap-2 min-w-0 min-h-0 w-full h-full")],
          [
            page,
            html.div([attribute.class("relative")], [
              case m.toast_display {
                option.None -> element.none()
                option.Some(toast) ->
                  html.div(
                    [
                      attribute.class(
                        "cursor-pointer absolute -top-20 bg-white text-black flex items-center gap-1 rounded-lg p-2 justify-self-center",
                      ),
                      event.on_click(msg.ClearToast),
                    ],
                    [
                      html.i(
                        [attribute.class("text-3xl ph-fill ph-" <> toast.icon)],
                        [],
                      ),
                      element.text(toast.message),
                    ],
                  )
              },
              playing_bar(m),
            ]),
          ],
        ),
      ]),
      fullscreen_player.view(m),
    ],
  )
}

fn top_bar(m: model.Model) {
  html.div([attribute.class("flex justify-between")], [
    html.div([attribute.class("flex gap-4")], [
      html.a([attribute.href("/library")], [
        elements.nav_button(
          html.i([attribute.class("text-3xl ph ph-cards-three")], []),
          html.i([attribute.class("text-3xl ph-fill ph-cards-three")], []),
          "Library",
          m.route == router.Library,
          [],
        ),
      ]),
      html.a([attribute.href("/")], [
        elements.nav_button(
          html.i([attribute.class("text-3xl ph ph-house")], []),
          html.i([attribute.class("text-3xl ph-fill ph-house")], []),
          "Home",
          m.route == router.Home,
          [attribute.class("w-42")],
        ),
      ]),
      // elements.button(
      //   html.i([attribute.class("text-3xl ph ph-sparkle")], []),
      //   "Discover",
      //   [attribute.class("w-42")],
      // ),
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
                attribute.class("w-80 focus:outline-none outline-none ring-0"),
                attribute.placeholder("Search"),
                attribute.value(query),
                attribute.autofocus(True),
                event.on_input(msg.Search),
              ]),
            ],
          )
        _ ->
          elements.nav_button(
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            html.i(
              [attribute.class("text-3xl ph-fill ph-magnifying-glass")],
              [],
            ),
            "Search",
            False,
            [event.on_click({ msg.Search("") })],
          )
      },
    ]),
    html.div(
      [attribute.class("flex items-center justify-center text-zinc-400")],
      [
        html.a([attribute.href("/about")], [
          button.button(button.About, button.Large, []),
        ]),
        case m.online {
          True -> element.none()
          False ->
            html.div(
              [
                attribute.class(
                  "flex px-2 my-1 rounded-full bg-white gap-1 text-black items-center justify-center",
                ),
              ],
              [
                html.i([attribute.class("text-3xl ph ph-globe-x")], []),
                html.span([], [element.text("Offline")]),
              ],
            )
        },
      ],
    ),
  ])
}

fn side_bar(m: model.Model) {
  html.div(
    [
      attribute.class(
        "flex flex-col gap-2 border border-zinc-800 rounded-lg py-4 px-1",
      ),
    ],
    [
      // the query doesn't actually filter to playlists only (yet)
      html.a([attribute.href("/library?filter=0")], [
        elements.nav_button(
          html.i([attribute.class("text-3xl ph ph-playlist")], []),
          html.i([attribute.class("text-3xl ph ph-playlist")], []),
          "Playlists",
          False,
          [],
        ),
      ]),
      html.a([attribute.href("/likes")], [
        elements.nav_button(
          html.i([attribute.class("text-3xl ph ph-heart-straight")], []),
          html.i([attribute.class("text-3xl ph-fill ph-heart-straight")], []),
          "Liked Songs",
          m.route == router.Likes,
          [],
        ),
      ]),
      // html.a([attribute.href("/albums")], [
    //   elements.button(
    //     html.i(
    //       [
    //         attribute.class("cursor-not-allowed text-3xl ph ph-vinyl-record"),
    //       ],
    //       [],
    //     ),
    //     "Albums",
    //     [],
    //   ),
    // ]),
    // html.a(
    //   [
    //     //attribute.href("/artists")
    //   ],
    //   [
    //     elements.button(
    //       html.i(
    //         [attribute.class("cursor-not-allowed text-3xl ph ph-user-sound")],
    //         [],
    //       ),
    //       "Artists",
    //       [],
    //     ),
    //   ],
    // ),
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
        "h-20 rounded-lg p-4 border border-zinc-800 flex gap-2 items-center justify-between",
      ),
    ],
    [
      html.div([attribute.class("flex gap-2 items-center w-1/3")], [
        html.div(
          [
            attribute.class(
              "flex-none w-14 h-14 bg-zinc-900 rounded-md flex items-center justify-center",
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
                    attribute.src(api.cover_url(
                      m.auth,
                      m.current_song.cover_art_id,
                      500,
                    )),
                    attribute.class(
                      "hover:opacity-50 transition-all duration-200 rounded-md object-cover",
                    ),
                  ]),
                ])
            },
          ],
        ),
        html.div([attribute.class("flex flex-col min-w-0")], [
          html.a(
            [
              attribute.href("/song/" <> m.current_song.id),
              attribute.class(
                "hover:underline font-normal overflow-hidden text-nowrap text-ellipsis min-w-0",
              ),
            ],
            [
              element.text(m.current_song.title),
            ],
          ),
          elements.artists(m.current_song.artists, []),
        ]),
        ..case m.current_song == models.new_song() {
          True -> [element.none()]
          False -> [
            button.button(
              button.Like(filled: m.current_song.starred),
              button.Medium,
              [
                attribute.class("ml-3"),
                case m.current_song.starred {
                  True -> attribute.class("text-violet-500")
                  False -> attribute.none()
                },
                event.on_click(msg.Like),
              ],
            ),
            playlist_menu.element(button_attrs: [], menu_attrs: [
              attribute.class("absolute bottom-92 right-96"),
              playlist_menu.song_id(m.current_song.id),
            ]),
          ]
        }
      ]),
      html.div([attribute.class("space-y-1")], [
        html.div([attribute.class("flex gap-4 justify-center items-center")], [
          button.button(button.Shuffle, button.Smallest, [
            case m.shuffled {
              True ->
                attribute.class(
                  "text-violet-400 underline underline-offset-4 decoration-dotted",
                )
              False -> attribute.none()
            },
            event.on_click(msg.PlayerShuffle),
          ]),
          button.button(button.SkipBackward, button.Smallest, [
            event.on_click(msg.PlayerPrevious),
          ]),
          button.button(
            case m.player |> player.is_paused {
              False -> button.Pause
              True -> button.Play
            },
            button.Large,
            [event.on_click(msg.PlayerPausePlay)],
          ),
          button.button(button.SkipForward, button.Smallest, [
            event.on_click(msg.PlayerNext),
          ]),
          button.button(button.Loop, button.Smallest, [
            case m.looping {
              True ->
                attribute.class(
                  "text-violet-400 underline underline-offset-4 decoration-dotted",
                )
              False -> attribute.none()
            },
            event.on_click(msg.PlayerLoop),
          ]),
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
            elements.music_slider(m, False, [attribute.class("w-96")]),
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
        html.div([attribute.class("flex gap-2 items-center")], [
          button.button(button.Volume, button.Medium, []),
          html.div([attribute.class("grid grid-cols-1 grid-rows-1")], [
            html.div(
              [
                attribute.class(
                  "col-start-1 row-start-1 bg-zinc-800 rounded-full h-1.5",
                ),
              ],
              [
                html.div(
                  [
                    attribute.class(
                      "bg-zinc-100 transition-[width] duration-100 rounded-full h-1.5",
                    ),
                    attribute.style(
                      "width",
                      float.to_string({ m.player |> player.get_volume() })
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
              attribute.value("100"),
              attribute.max("105"),
              event.on("input", {
                use value <- decode.subfield(["target", "value"], decode.string)
                let assert Ok(vol_amount) = int.parse(value)
                decode.success(msg.PlayerVolume(vol_amount))
              }),
              attribute.type_("range"),
            ]),
          ]),
        ]),
        button.button(button.FullscreenPlayer, button.Medium, [
          event.on_click(msg.ToggleFullscreenPlayer),
        ]),
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
                  elements.song(
                    queue_entry.1,
                    [
                      case m.current_song.id == { queue_entry.1 }.id {
                        True -> attribute.attribute("data-playing", "")
                        False -> attribute.none()
                      },
                    ],
                    cover_art: True,
                    msg: { msg.QueueJumpTo(queue_entry.0) },
                  )
                }),
              ),
            ],
          ),
        ]),
      ]),
    ],
  )
}
