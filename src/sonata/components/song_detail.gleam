import gleam/list
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import sonata/elements
import sonata/model

pub type Model {
  Model(id: String, current_tab: DetailTab)
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
}

pub fn register() -> Result(Nil, lustre.Error) {
  let component =
    lustre.component(init, update, view, [
      //component.on_attribute_change("id", fn(value) { todo }),
    ])
  lustre.register(component, "song-detail")
}

pub fn element(attrs: List(attribute.Attribute(msg))) -> element.Element(msg) {
  element.element("song-detail", attrs, [])
}

pub fn id(id: String) -> attribute.Attribute(msg) {
  attribute.attribute("id", id)
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(Model(id: "", current_tab: Lyrics), effect.none())
}

fn update(m: Model, msg: Msg) {
  case msg {
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
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
      //Lyrics -> view_lyrics(m)
      //More -> view_more(m)
      _ -> [element.none()]
    }),
  ])
}

fn view_lyrics(m: Model) {
  let lyrics = [
    model.SongLyric(2000, "Darling, I'm a masterpiece, a work of art"),
    model.SongLyric(4000, "Hi, my name is Fabulous, your favorite star"),
    model.SongLyric(6000, "Diamonds on my wrist, come, blow me a kiss"),
    model.SongLyric(8000, "'Cause, hi, my name is Fabulous, your favorite star"),
    model.SongLyric(11_000, "Oh, when I walk down the boulevard"),
    model.SongLyric(12_000, "People call my name"),
  ]

  let current_time = 6000

  [
    html.div([attribute.class("flex px-6 py-8 gap-24")], [
      html.div([attribute.class("flex flex-col gap-4 text-zinc-500")], [
        // toggle time synced lyrics?
        html.i([attribute.class("text-4xl ph ph-clock-countdown")], []),
        html.i([attribute.class("text-4xl ph ph-text-aa")], []),
      ]),
      html.div(
        [attribute.class("space-y-2")],
        list.map(lyrics, fn(lyric: model.SongLyric) {
          html.p(
            [
              attribute.class("font-semibold text-2xl"),
              case current_time > lyric.time {
                True -> attribute.class("text-zinc-300")
                False -> attribute.class("text-zinc-600")
              },
            ],
            [element.text(lyric.line)],
          )
        }),
      ),
    ]),
  ]
}
