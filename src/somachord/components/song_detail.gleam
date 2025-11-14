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
import somachord/components/lyrics
import somachord/model
import somachord/storage
import varasto

pub type Model {
  Model(id: String, current_tab: DetailTab)
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
  Nothing
}

pub fn register() -> Result(Nil, lustre.Error) {
  let component =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(value) { Ok(SongID(value)) }),
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
  #(Model(id: "", current_tab: Lyrics), effect.none())
}

fn update(m: Model, msg: Msg) {
  case msg {
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    SongID(id) -> #(Model(..m, id: id), effect.none())
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
      [
        tab_element(m, Lyrics),
        // tab_element(m, More)
      ],
    ),
    html.div([attribute.class("p-4")], case m.current_tab {
      // Lyrics -> [lyrics.element([lyrics.id(m.id), lyrics.time(m.song_time)])]
      // More -> view_more(m)
      _ -> [element.none()]
    }),
  ])
}
