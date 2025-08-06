import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import gleam/uri
import sonata/api
import sonata/api_helper
import sonata/models/auth
import sonata/storage
import varasto

import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event

import sonata/elements
import sonata/model
import sonata/msg

type Model {
  Model(
    current_tab: DetailTab,
    artist: option.Option(Result(model.Artist, Nil)),
    artist_id: String,
    top_songs: List(model.Child),
    auth_details: auth.Auth,
  )
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

type Msg {
  ChangeTab(DetailTab)
  ArtistID(String)
  SonataMsg(msg.Msg)
  PlayArtist
  PlayAlbum(id: String)
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.on_attribute_change("artist-id", fn(value) {
        Ok(value |> ArtistID)
      }),
    ])
  lustre.register(app, "artist-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "artist-page",
    [
      attribute.class(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-none [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
      ),
      ..attrs
    ],
    [],
  )
}

fn init(_) {
  #(
    Model(
      artist_id: "",
      current_tab: Home,
      artist: option.None,
      top_songs: [],
      auth_details: {
        let assert Ok(stg) = storage.create() |> varasto.get("auth")
        stg.auth
      },
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    ArtistID(id) -> #(
      Model(..m, artist_id: id),
      case storage.create() |> varasto.get("auth") {
        Ok(stg) -> api.artist(stg.auth, id) |> effect.map(SonataMsg)
        Error(_) -> effect.none()
      },
    )
    SonataMsg(msg.SubsonicResponse(Ok(api_helper.Artist(artist)))) -> #(
      Model(..m, artist: option.Some(Ok(artist))),
      api.top_songs(m.auth_details, artist.name) |> effect.map(SonataMsg),
    )
    SonataMsg(msg.SubsonicResponse(Ok(api_helper.TopSongs(songs)))) -> #(
      Model(..m, top_songs: songs),
      effect.none(),
    )
    SonataMsg(msg.SubsonicResponse(Error(e))) -> {
      echo e
      #(m, effect.none())
    }
    PlayArtist -> #(
      m,
      event.emit(
        "play",
        json.object([
          #("id", json.string(m.artist_id)),
          #("type", json.string("artist")),
        ]),
      ),
    )
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    _ -> #(m, effect.none())
  }
}

fn view(m: Model) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div([attribute.class("h-full")], [
    html.div(
      [
        attribute.class("relative h-[45%] p-8 flex items-end bg-violet-950"),
        attribute.style("background-position-y", "20%"),
        case option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil)) {
          Ok(artist) ->
            attribute.style(
              "background-image",
              "url('"
                <> api_helper.create_uri(
                "/rest/getCoverArt.view",
                auth_details,
                [#("id", artist.cover_art_id), #("size", "500")],
              )
              |> uri.to_string
                <> "')",
            )
          Error(_) -> attribute.none()
        },
        attribute.class("rounded-tl-md bg-cover bg-center"),
      ],
      [
        html.div(
          [
            attribute.class(
              "bg-linear-to-l from-zinc-950 from-10% to-zinc-950/50 absolute top-0 left-0 h-full w-full",
            ),
          ],
          [],
        ),
        html.div(
          [attribute.class("z-20 flex items-center justify-between w-full")],
          [
            html.div([], [
              html.h1([attribute.class("font-extrabold text-5xl")], [
                element.text(
                  case
                    option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil))
                  {
                    Ok(artist) -> artist.name
                    Error(_) -> ""
                  },
                ),
              ]),
            ]),
            html.div([attribute.class("flex items-center")], [
              html.div(
                [
                  attribute.class("flex items-center relative"),
                  event.on_click(PlayArtist),
                ],
                [
                  html.div(
                    [
                      attribute.class(
                        "ml-2 z-5 absolute rounded-full bg-black w-8 h-8",
                      ),
                    ],
                    [],
                  ),
                  html.i(
                    [
                      attribute.class(
                        "z-10 ph-fill ph-play-circle text-6xl text-violet-500",
                      ),
                    ],
                    [],
                  ),
                ],
              ),
            ]),
          ],
        ),
      ],
    ),
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
    ]),
  ])
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

fn view_home(m: Model) {
  [
    html.div([attribute.class("w-full space-y-4")], [
      html.h1([attribute.class("font-semibold text-xl")], [
        element.text("Most Popular"),
      ]),
      html.div(
        [attribute.class("space-y-4")],
        list.index_map(m.top_songs, fn(song: model.Child, index: Int) {
          elements.song(song:, index:, attrs: [], cover_art: True)
        }),
      ),
    ]),
  ]
}

fn view_albums(m: Model) {
  [
    html.div(
      [attribute.class("flex flex-wrap gap-4")],
      case option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil)) {
        Ok(artist) ->
          list.map(artist.albums, fn(album: model.Album) {
            elements.album(album, fn(id) { PlayAlbum(id) })
          })
        Error(_) -> [element.none()]
      },
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
