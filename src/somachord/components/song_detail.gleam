import gleam/dynamic/decode
import gleam/float
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
import somachord/api
import somachord/api_helper
import somachord/api_models
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
    Playtime(time) -> #(Model(..m, song_time: option.Some(time)), effect.none())
    LyricsRetrieved(lyricsets) -> #(Model(..m, lyricsets:), effect.none())
    Nothing -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div([attribute.class("font-[Poppins]")], [
    html.div(
      [
        attribute.class(
          "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400",
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
      lyricset.lang == m.chosen_lyric_set
    })
    |> result.replace_error(case m.lyricsets {
      [first, ..] -> first
      _ -> api_models.LyricSet(synced: False, lang: "und", lines: [])
    })
    |> result.unwrap_both

  [
    html.div([attribute.class("flex px-6 py-8 gap-24")], [
      html.div([attribute.class("flex flex-col gap-4 text-zinc-500")], [
        // toggle time synced lyrics?
        html.i([attribute.class("text-4xl ph ph-clock-countdown")], []),
        html.i([attribute.class("text-4xl ph ph-translate")], []),
        html.i([attribute.class("text-4xl ph ph-text-aa")], []),
      ]),
      html.div(
        [attribute.class("space-y-2")],
        list.map(lyrics.lines, fn(lyric: api_models.Lyric) {
          html.p(
            [
              attribute.class("font-semibold text-2xl text-zinc-300"),
              case m.song_time {
                option.None -> attribute.none()
                option.Some(current_time) ->
                  case current_time >. { lyric.time -. 0.5 } {
                    True -> attribute.class("text-zinc-300")
                    False -> attribute.class("text-zinc-600")
                  }
              },
            ],
            [element.text(lyric.text)],
          )
        }),
      ),
    ]),
  ]
}
