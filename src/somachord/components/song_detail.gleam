import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/javascript/array
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import plinth/browser/document
import plinth/browser/shadow
import rsvp
import somachord/api/api
import somachord/api_models
import somachord/components
import somachord/storage
import varasto

pub type Model {
  Model(
    id: String,
    current_tab: DetailTab,
    lyricsets: option.Option(List(api_models.LyricSet)),
    // lang of lyric set chosed
    chosen_lyric_set: String,
    song_time: option.Option(Float),
    auto_scroll: Bool,
    font_size: Size,
    show_size_changer: Bool,
  )
}

pub type DetailTab {
  Lyrics
  More
}

pub type Size {
  Small
  Medium
  Large
}

fn tab_as_string(tab: DetailTab) {
  case tab {
    Lyrics -> "Lyrics"
    More -> "More"
  }
}

fn tab_element(m: Model, tab: DetailTab) {
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
                "absolute top-9 w-full h-1 border-b border-violet-500",
              ),
            ],
            [],
          )
        False -> element.none()
      },
    ],
  )
}

type Msg {
  ChangeTab(DetailTab)
  SongID(id: String)
  Playtime(time: Float)
  LyricsRetrieved(
    Result(Result(List(api_models.LyricSet), api.SubsonicError), rsvp.Error),
  )
  ToggleAutoscroll
  SizeChange(Size)
  ToggleSizeChanger
  Nothing
}

pub fn register() -> Result(Nil, lustre.Error) {
  let component =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(value) { Ok(SongID(value)) }),
      component.on_property_change("time", {
        decode.float |> decode.map(Playtime)
      }),
    ])
  lustre.register(component, "song-detail")
}

pub fn element(attrs: List(attribute.Attribute(msg))) -> element.Element(msg) {
  element.element("song-detail", [attribute.class("h-screen"), ..attrs], [])
}

pub fn id(id: String) -> attribute.Attribute(msg) {
  attribute.attribute("song-id", id)
}

pub fn song_time(time: Float) -> attribute.Attribute(msg) {
  attribute.property("time", json.float(time))
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(
      id: "",
      current_tab: Lyrics,
      lyricsets: option.None,
      chosen_lyric_set: "xxx",
      song_time: option.None,
      auto_scroll: True,
      font_size: Medium,
      show_size_changer: False,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    SongID(id) -> #(m, case storage.create() |> varasto.get("auth") {
      Error(_) -> effect.none()
      Ok(stg) -> {
        use <- bool.guard(id == "", effect.none())
        api.lyrics(stg.auth, id, LyricsRetrieved)
      }
    })
    Playtime(time) -> {
      let ret = #(Model(..m, song_time: option.Some(time)), effect.none())
      use <- bool.guard(bool.negate(m.auto_scroll), ret)
      // song-detail is used in song-page (also a component).
      // this is the only way to get its shadow root, and to query for elements in a shadow dom.
      let assert Ok(parent_elem) =
        document.get_elements_by_tag_name("song-page") |> array.get(0)
      let assert Ok(parent_shadow_root) = shadow.shadow_root(parent_elem)
      let assert Ok(elem) =
        shadow.query_selector(parent_shadow_root, "song-detail")
      let assert Ok(shadow_root) = shadow.shadow_root(elem)
      case
        shadow.query_selector_all(shadow_root, ".off-time")
        |> components.elems_to_array
        |> array.to_list
        |> list.take(5)
        |> list.reverse
        |> list.first
      {
        Ok(elem) -> components.scroll_into_view(elem)
        Error(_) -> Nil
      }
      ret
    }
    LyricsRetrieved(Error(e)) -> {
      echo e
      panic as "rsvp error"
    }
    LyricsRetrieved(Ok(Error(e))) -> {
      case e {
        api.NotFound -> #(Model(..m, lyricsets: option.Some([])), effect.none())
        _ -> {
          echo e
          panic as "should be unreachable"
        }
      }
    }
    LyricsRetrieved(Ok(Ok(lyricsets))) -> #(
      Model(..m, lyricsets: option.Some(lyricsets)),
      effect.none(),
    )
    ToggleAutoscroll -> #(
      Model(..m, auto_scroll: bool.negate(m.auto_scroll)),
      effect.none(),
    )
    ToggleSizeChanger -> #(
      Model(..m, show_size_changer: bool.negate(m.show_size_changer)),
      effect.none(),
    )
    SizeChange(size) -> #(Model(..m, font_size: size), effect.none())
    Nothing -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div([attribute.class("font-[Poppins,sans-serif]")], [
    html.div(
      [
        attribute.class(
          "sticky top-0 border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 bg-zinc-950",
        ),
      ],
      [tab_element(m, Lyrics), tab_element(m, More)],
    ),
    html.div([attribute.class("p-4")], case m.current_tab {
      Lyrics -> [view_lyrics(m)]
      //More -> view_more(m)
      _ -> [element.none()]
    }),
  ])
}

fn view_lyrics(m: Model) {
  html.div(
    [attribute.class("flex px-6 py-8 gap-24")],
    {
      use lyricsets <- result.try(
        m.lyricsets
        |> option.to_result([
          html.div([attribute.class("flex justify-center w-full h-full")], [
            html.i(
              [
                attribute.class("ph ph-spinner-ball animate-spin text-3xl"),
              ],
              [],
            ),
          ]),
        ]),
      )
      use <- bool.guard(
        lyricsets |> list.is_empty,
        Error([
          html.h1([attribute.class("font-[Poppins] font-semibold text-3xl")], [
            element.text("No Lyrics Found"),
          ]),
        ]),
      )
      let lyrics =
        list.find(lyricsets, fn(lyricset: api_models.LyricSet) {
          // chosen_lyric_set defaults to xxx but just in case it isnt
          { lyricset.lang == m.chosen_lyric_set }
          |> bool.or(lyricset.lang == "xxx")
          |> bool.or(lyricset.lang == "und")
        })
        |> result.replace_error(case lyricsets {
          [first, ..] -> first
          _ ->
            api_models.LyricSet(
              synced: False,
              lang: "und",
              offset: 0.0,
              lines: [],
            )
        })
        |> result.unwrap_both

      [
        html.div(
          [
            attribute.class(
              "sticky h-fit top-25 flex flex-col gap-4 text-zinc-500",
            ),
          ],
          [
            // toggle time synced lyrics?
            auto_scroll(m, lyrics),
            //html.i([attribute.class("text-4xl ph ph-translate")], []),
            font_size(m),
          ],
        ),
        html.div(
          [
            attribute.class("space-y-2"),
            attribute.class(case m.font_size {
              Small -> "text-lg"
              Medium -> "text-2xl"
              Large -> "text-4xl/12"
            }),
          ],
          list.map(lyrics.lines, fn(lyric: api_models.Lyric) {
            html.p(
              [
                attribute.class("font-semibold"),
                case m.song_time {
                  option.None | option.Some(-1.0) ->
                    attribute.class("text-zinc-300")
                  option.Some(current_time) ->
                    case
                      { current_time +. lyrics.offset } >. { lyric.time -. 0.5 }
                    {
                      True -> attribute.class("text-zinc-300")
                      False -> attribute.class("text-zinc-600 off-time")
                    }
                },
              ],
              [element.text(lyric.text)],
            )
          }),
        ),
      ]
      |> Ok
    }
      |> result.unwrap_both,
  )
}

fn auto_scroll(m: Model, lyricset: api_models.LyricSet) {
  html.i(
    [
      attribute.class(
        "after:hidden after:font-sans after:text-xs after:self-center after:no-underline hover:after:block hover:after:absolute after:top-2 after:left-full after:ml-2 after:border after:border-black after:bg-zinc-900 after:text-white after:rounded-full after:text-nowrap after:px-4 after:py-1 after:content-[attr(data-tooltip)]",
      ),
      attribute.class("text-4xl ph ph-clock-countdown"),
      event.on_click(ToggleAutoscroll),
      ..case m.auto_scroll, lyricset.synced {
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
          case m.show_size_changer {
            False -> attribute.class("invisible")
            True -> attribute.class("visible")
          },
        ],
        [
          html.input([
            attribute.class("accent-violet-500"),
            attribute.type_("range"),
            attribute.max("2"),
            event.on("input", {
              use value <- decode.subfield(["target", "value"], decode.string)
              let assert Ok(num) = int.parse(value)
              let size = case num {
                0 -> Small
                1 -> Medium
                2 -> Large
                _ -> Medium
              }

              decode.success(SizeChange(size))
            }),
          ]),
        ],
      ),
    ],
  )
}
