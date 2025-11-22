import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/uri
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import rsvp
import somachord/api/api
import somachord/api/models as api_models

import somachord/components
import somachord/components/lyrics
import somachord/components/playlist_menu
import somachord/elements
import somachord/model
import somachord/storage
import varasto

pub type Tab {
  Lyrics
  More
}

fn tab_as_string(tab: Tab) {
  case tab {
    Lyrics -> "Lyrics"
    More -> "More"
  }
}

fn tab_element(m: Model, tab: Tab) {
  html.span(
    [
      event.on_click(ChangeTab(tab)),
      attribute.class("relative cursor-pointer"),
      case tab == m.current_tab {
        True -> attribute.class("text-zinc-100")
        False -> attribute.class("text-zinc-500 hover:text-zinc-300")
      },
    ],
    [
      element.text(tab_as_string(tab)),
      case tab == m.current_tab {
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

pub type Model {
  Model(
    song: api_models.Child,
    playtime: option.Option(Float),
    current_tab: Tab,
    font_size: lyrics.Size,
    auto_scroll: Bool,
    size_changer: Bool,
  )
}

pub type Msg {
  SongID(String)
  SongResponse(Result(Result(api_models.Child, api.SubsonicError), rsvp.Error))
  ChangeTab(Tab)
  PlaySong
  Playtime(Float)

  ToggleSizeChanger
  ToggleAutoscroll
  SizeChange(lyrics.Size)

  Nothing
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(value) { Ok(value |> SongID) }),
      component.on_property_change("time", {
        decode.float |> decode.map(Playtime)
      }),
    ])
  lustre.register(app, "song-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "song-page",
    [
      attribute.class(
        "flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
      ),
      ..attrs
    ],
    [],
  )
}

pub fn song_time(time: Float) -> attribute.Attribute(msg) {
  attribute.property("time", json.float(time))
}

fn init(_) {
  #(
    Model(
      song: api_models.new_song(),
      playtime: option.None,
      current_tab: Lyrics,
      font_size: lyrics.Medium,
      auto_scroll: True,
      size_changer: False,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    SongID(id) -> #(
      m,
      api.song(
        {
          let assert Ok(stg) = storage.create() |> varasto.get("auth")
          stg.auth
        },
        id:,
        msg: SongResponse,
      ),
    )
    SongResponse(Ok(Ok(song))) -> #(Model(..m, song:), effect.none())
    PlaySong -> #(
      m,
      event.emit(
        "play",
        json.object([
          #("type", json.string("song")),
          #("id", json.string(m.song.id)),
        ]),
      ),
    )
    Playtime(time) -> #(Model(..m, playtime: option.Some(time)), effect.none())
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    ToggleAutoscroll -> #(
      Model(..m, auto_scroll: bool.negate(m.auto_scroll)),
      effect.none(),
    )
    SizeChange(size) -> #(Model(..m, font_size: size), effect.none())
    ToggleSizeChanger -> #(
      Model(..m, size_changer: bool.negate(m.size_changer)),
      effect.none(),
    )
    _ -> #(m, effect.none())
  }
}

fn view(m: Model) {
  let song = m.song
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div([components.redirect_click(Nothing)], [
    html.div([attribute.class("flex flex-wrap gap-8 p-8")], [
      case song.id {
        // when song hasnt been retrieved yet
        "" ->
          html.div([attribute.class("w-80 h-80 rounded-md bg-zinc-800")], [])
        _ ->
          html.img([
            attribute.src(api.cover_url(auth_details, song.cover_art_id, 500)),
            attribute.class("w-80 h-80 object-cover rounded-md"),
          ])
      },
      html.div([attribute.class("flex flex-col gap-4")], [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(song.title),
        ]),
        html.div(
          [
            attribute.class(
              "flex flex-wrap gap-3 text-xs text-zinc-400 items-center",
            ),
          ],
          [
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-user-sound")], []),
              html.span(
                [attribute.class("text-zinc-300")],
                list.map(song.artists, fn(artist: api_models.SmallArtist) {
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
            html.span([], [element.text("•")]),
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-vinyl-record")], []),
              html.a([attribute.href("/album/" <> song.album_id)], [
                html.span([attribute.class("hover:underline text-zinc-300")], [
                  element.text(song.album_name),
                ]),
              ]),
            ]),
            html.span([], [element.text("•")]),
            html.span([], [element.text(song.year |> int.to_string)]),
            html.span([], [element.text("•")]),
            elements.time(song.duration, []),
            ..case song.plays > 0 {
              False -> [element.none()]
              True -> [
                html.span([], [element.text("•")]),
                html.span([], [
                  element.text(
                    song.plays |> int.to_string
                    <> " play"
                    <> case song.plays == 1 {
                      False -> "s"
                      True -> ""
                    },
                  ),
                ]),
              ]
            }
          ],
        ),
        html.div(
          [attribute.class("text-zinc-400 flex gap-4 items-center -ml-1")],
          [
            html.i(
              [
                attribute.class(
                  "text-5xl text-violet-500 ph-fill ph-play-circle",
                ),
                event.on_click(PlaySong),
              ],
              [],
            ),
            playlist_menu.element([], []),
            html.i([attribute.class("text-3xl ph ph-download-simple")], []),
            html.i([attribute.class("text-3xl ph ph-link")], []),
            html.i([attribute.class("text-3xl ph ph-dots-three")], []),
          ],
        ),
        // html.div([attribute.class("flex flex-wrap gap-4")], [
      //   elements.tag("K-Pop"),
      //   elements.tag("R&B"),
      // ]),
      ]),
    ]),
    html.div([attribute.class("font-[Poppins,sans-serif]")], [
      html.div(
        [
          attribute.class(
            "sticky top-0 border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 bg-zinc-950",
          ),
        ],
        [
          tab_element(m, Lyrics),
          // tab_element(m, More)
        ],
      ),
      html.div([attribute.class("p-4")], case m.current_tab {
        Lyrics -> [
          html.div([attribute.class("flex px-6 py-8 gap-24")], [
            html.div(
              [
                attribute.class(
                  "sticky h-fit top-25 flex flex-col gap-4 text-zinc-500",
                ),
              ],
              [
                auto_scroll(m),
                // html.i([attribute.class("text-4xl ph ph-translate")], []),
                font_size(m),
              ],
            ),
            lyrics.element([
              lyrics.nested_shadow(True),
              lyrics.id(m.song.id),
              lyrics.song_time(m.playtime |> option.unwrap(-1.0)),
              lyrics.auto_scroll(m.auto_scroll),
              lyrics.size(m.font_size),
            ]),
          ]),
        ]
        // More -> view_more(m)
        _ -> [element.none()]
      }),
    ]),
    case components.layout() {
      model.Desktop -> element.none()
      model.Mobile -> components.mobile_space()
    },
  ])
}

fn auto_scroll(m: Model) {
  html.i(
    [
      attribute.class(
        "after:hidden after:font-sans after:text-xs after:self-center after:no-underline hover:after:block hover:after:absolute after:top-2 after:left-full after:ml-2 after:border after:border-black after:bg-zinc-900 after:text-white after:rounded-full after:text-nowrap after:px-4 after:py-1 after:content-[attr(data-tooltip)]",
      ),
      attribute.class("text-4xl ph ph-clock-countdown"),
      event.on_click(ToggleAutoscroll),
      ..case m.auto_scroll, True {
        True, True -> [
          attribute.attribute("data-tooltip", "Toggle Auto-scroll"),
          attribute.class("text-violet-400"),
        ]
        False, True -> [
          attribute.attribute("data-tooltip", "Toggle Auto-scroll"),
          attribute.none(),
        ]
        _, _ -> [
          attribute.attribute("data-tooltip", "Lyrics are unsynced"),
          attribute.class("cursor-not-allowed text-zinc-700"),
        ]
      }
    ],
    [],
  )
}

fn font_size(m: Model) {
  html.i(
    [
      event.on_click(ToggleSizeChanger),
      attribute.class("text-4xl ph ph-text-aa"),
    ],
    [
      html.span(
        [
          attribute.class(
            "inline-flex items-center absolute self-center ml-4 bg-zinc-900 py-2 px-4 rounded-full",
          ),
          case m.size_changer {
            False -> attribute.class("invisible")
            True -> attribute.class("visible")
          },
        ],
        [
          html.input([
            attribute.class("accent-violet-500"),
            attribute.type_("range"),
            attribute.max("2"),
            attribute.value(case m.font_size {
              lyrics.Small -> "0"
              lyrics.Medium -> "1"
              lyrics.Large -> "2"
            }),
            event.on("input", {
              use value <- decode.subfield(["target", "value"], decode.string)
              let assert Ok(num) = int.parse(value)
              let size = case num {
                0 -> lyrics.Small
                1 -> lyrics.Medium
                2 -> lyrics.Large
                _ -> lyrics.Medium
              }

              decode.success(SizeChange(size))
            }),
          ]),
        ],
      ),
    ],
  )
}
