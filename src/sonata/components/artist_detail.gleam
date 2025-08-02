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
  Home
  Albums
  SinglesEPs
  About
}

fn tab_as_string(tab: DetailTab) {
  case tab {
    Home -> "Home"
    Albums -> "Albums"
    SinglesEPs -> "Singles & EPs"
    About -> "About"
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
  lustre.register(component, "artist-detail")
}

pub fn element(attrs: List(attribute.Attribute(msg))) -> element.Element(msg) {
  element.element("artist-detail", attrs, [])
}

pub fn id(id: String) -> attribute.Attribute(msg) {
  attribute.attribute("id", id)
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(Model(id: "", current_tab: About), effect.none())
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
      [
        tab_element(m, Home),
        tab_element(m, Albums),
        tab_element(m, SinglesEPs),
        tab_element(m, About),
      ],
    ),
    html.div([attribute.class("p-4 flex")], case m.current_tab {
      Home -> view_home(m)
      Albums -> view_albums(m)
      About -> view_about(m)
      _ -> [element.none()]
    }),
  ])
}

fn view_home(m: Model) {
  [
    html.div([attribute.class("w-full space-y-4")], [
      html.h1([attribute.class("font-semibold text-xl")], [
        element.text("Your Most Played"),
      ]),
      html.div(
        [attribute.class("space-y-4")],
        list.index_map(
          model.Song(
            id: "0",
            title: "Fabulous",
            album: "To. X",
            artist: "TAEYEON",
            duration: 0,
          )
            |> list.repeat(5),
          fn(song: model.Song, index: Int) {
            elements.song(song:, index:, attrs: [])
          },
        ),
      ),
    ]),
  ]
}

fn view_albums(m) {
  [
    html.div(
      [attribute.class("flex flex-wrap gap-4")],
      list.map(
        model.Album(
          id: "",
          artist: "TAEYEON",
          name: "To. X",
          version: "",
          year: 2023,
        )
          |> list.repeat(10),
        fn(album: model.Album) { elements.album(album) },
      ),
    ),
  ]
}

fn view_about(m) {
  [
    html.div([attribute.class("flex gap-8 p-4")], [
      html.div([attribute.class("relative")], [
        html.h1(
          [attribute.class("z-2 text-3xl absolute left-24 top-30 font-bold")],
          [element.text("#1 On Sonata")],
        ),
        html.div([attribute.class("wavy-circle bg-violet-500 self-start")], []),
      ]),
      html.p([attribute.class("z-1 flex-1 text-zinc-300 text-md leading-8")], [
        element.text(
          "Known as the “Certified Vocal Queen”, TAEYEON started her music career in 2007 as a member and lead vocalist of Girls’ Generation, the legendary K-pop group that gained worldwide reputation as the No. 1 girl group in Asia. She is now one of the most respected female vocalists in the industry, capturing the hearts of many around the world, and making remarkable accomplishments as a solo artist.

Before making her official solo debut, TAEYEON participated in numerous original soundtracks that were highly successful in Korean music charts. In 2015, she released her first solo EP ‘I’ which ranked No. 1 on various Korean music charts as well as Billboard’s World Albums chart. Since then, TAEYEON released a handful of hit singles that topped the music charts including ‘I’ ‘Rain’, ‘Why’, ‘11:11’, ‘Fine’, ‘Four Seasons’, ‘Spark’, ‘Happy’ and ‘Weekend’ earning her numerous awards and nominations throughout her career. Most notably in January 2022, it was announced that TAEYEON has the highest album sales among solo female artists over the past decade according to Gaon Chart‘s 10-year cumulative album sales data, which made a big splash in the K-pop industry, proving her status as the “Certified Vocal Queen”. Most recently, ahead of her 3rd LP, she released a new single ‘Can’t Control Myself’ which hit No. 1 on iTunes Top Songs chart in 14 regions around the world once again proving her global popularity.

",
        ),
      ]),
    ]),
  ]
}
