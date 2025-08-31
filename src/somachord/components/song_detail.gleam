import gleam/bool
import gleam/dynamic/decode
import gleam/float
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
import somachord/api
import somachord/api_helper
import somachord/api_models
import somachord/components
import somachord/elements
import somachord/model
import somachord/msg
import somachord/storage
import varasto

pub type Model {
  Model(
    id: String,
    current_tab: DetailTab,
    lyricsets: List(api_models.LyricSet),
    // lang of lyric set chosed
    chosen_lyric_set: String,
    song_time: option.Option(Float),
    auto_scroll: Bool,
  )
}

pub type DetailTab {
  Lyrics
  More
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
  LyricsRetrieved(List(api_models.LyricSet))
  ToggleAutoscroll
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
      lyricsets: [],
      chosen_lyric_set: "xxx",
      song_time: option.None,
      auto_scroll: True,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    SongID(id) -> #(m, case storage.create() |> varasto.get("auth") {
      Error(_) -> effect.none()
      Ok(stg) ->
        api.lyrics(stg.auth, id)
        |> effect.map(fn(msg: msg.Msg) {
          case msg {
            msg.SubsonicResponse(Ok(api_helper.Lyrics(lyricsets))) ->
              LyricsRetrieved(lyricsets)
            _ -> {
              echo msg
              Nothing
            }
          }
        })
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
        shadow.query_selector_all(shadow_root, "#off-time")
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
    LyricsRetrieved(lyricsets) -> #(Model(..m, lyricsets:), effect.none())
    ToggleAutoscroll -> #(
      Model(..m, auto_scroll: bool.negate(m.auto_scroll)),
      effect.none(),
    )
    Nothing -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div([attribute.class("font-[Poppins]")], [
    html.div(
      [
        attribute.class(
          "sticky top-0 border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 bg-zinc-950",
        ),
      ],
      [tab_element(m, Lyrics), tab_element(m, More)],
    ),
    html.div([attribute.class("p-4")], case m.current_tab {
      Lyrics -> view_lyrics(m)
      //More -> view_more(m)
      _ -> [element.none()]
    }),
  ])
}

fn view_lyrics(m: Model) {
  let lyrics =
    list.find(m.lyricsets, fn(lyricset: api_models.LyricSet) {
      // chosen_lyric_set defaults to xxx but just in case it isnt
      { lyricset.lang == m.chosen_lyric_set }
      |> bool.or(lyricset.lang == "xxx")
      |> bool.or(lyricset.lang == "und")
    })
    |> result.replace_error(case m.lyricsets {
      [first, ..] -> first
      _ -> api_models.LyricSet(synced: False, lang: "und", lines: [])
    })
    |> result.unwrap_both

  [
    html.div([attribute.class("flex px-6 py-8 gap-24")], [
      html.div(
        [
          attribute.class(
            "sticky h-fit top-25 flex flex-col gap-4 text-zinc-500",
          ),
        ],
        [
          // toggle time synced lyrics?
          html.i(
            [
              attribute.class(
                "after:hidden after:font-sans after:text-xs after:self-center after:no-underline hover:after:block hover:after:absolute after:top-2 after:left-full after:ml-2 after:border after:border-black after:bg-zinc-900 after:text-white after:rounded-full after:text-nowrap after:px-4 after:py-1 after:content-[attr(data-tooltip)]",
              ),
              attribute.attribute("data-tooltip", "Toggle Auto-scroll"),
              attribute.class("text-4xl ph ph-clock-countdown"),
              case m.auto_scroll {
                True -> attribute.class("text-violet-400")
                False -> attribute.none()
              },
              event.on_click(ToggleAutoscroll),
            ],
            [],
          ),
          html.i([attribute.class("text-4xl ph ph-translate")], []),
          html.i([attribute.class("text-4xl ph ph-text-aa")], []),
        ],
      ),
      html.div(
        [attribute.class("space-y-2")],
        list.map(lyrics.lines, fn(lyric: api_models.Lyric) {
          html.p(
            [
              attribute.class("font-semibold text-zinc-300"),
              ..case m.song_time {
                option.None | option.Some(-1.0) -> [attribute.none()]
                option.Some(current_time) ->
                  case current_time >. { lyric.time -. 0.5 } {
                    True -> [attribute.class("text-zinc-300")]
                    False -> [
                      attribute.class("text-zinc-600"),
                      attribute.id("off-time"),
                    ]
                  }
              }
            ],
            [element.text(lyric.text)],
          )
        }),
      ),
    ]),
  ]
}
