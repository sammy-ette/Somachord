import gleam/bool
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import gleam/uri
import rsvp
import somachord/api/api
import somachord/elements/button
import somachord/pages/error

import somachord/components
import somachord/model
import somachord/models/auth
import somachord/storage
import varasto

import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event

import somachord/api/models as api_models
import somachord/elements

type Model {
  Model(
    current_tab: DetailTab,
    artist: option.Option(Result(api_models.Artist, Nil)),
    artist_id: String,
    top_songs: List(api_models.Child),
    auth_details: option.Option(auth.Auth),
    layout: model.Layout,
    page_error: option.Option(error.ErrorType),
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
  ArtistRetrieved(
    Result(Result(api_models.Artist, api.SubsonicError), rsvp.Error),
  )
  TopSongsRetrieved(
    Result(Result(List(api_models.Child), api.SubsonicError), rsvp.Error),
  )
  PlayArtist
  PlayAlbum(id: String)
  PlaySong(id: String)
  Nothing
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
        "flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
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
      auth_details: case storage.create() |> varasto.get("auth") {
        Ok(stg) -> option.Some(stg.auth)
        Error(_) -> option.None
      },
      layout: components.layout(),
      page_error: option.None,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    ArtistID(id) -> #(
      Model(..m, artist_id: id, page_error: option.None),
      case m.auth_details {
        option.Some(auth) -> api.artist(auth, id, ArtistRetrieved)
        option.None -> effect.none()
      },
    )
    ArtistRetrieved(Ok(Ok(artist))) -> {
      let assert option.Some(auth_details) = m.auth_details
      #(
        Model(..m, artist: option.Some(Ok(artist))),
        api.top_songs(auth_details, artist.name, TopSongsRetrieved),
      )
    }
    ArtistRetrieved(Ok(Error(_))) -> panic as "idk this guy"
    ArtistRetrieved(Error(e)) -> #(
      Model(..m, page_error: option.Some(error.from_rsvp(e))),
      effect.none(),
    )
    TopSongsRetrieved(Ok(Ok(songs))) -> #(
      Model(..m, top_songs: songs),
      effect.none(),
    )
    PlayArtist -> #(m, event.emit("play", play_json(m.artist_id, "artist")))
    PlayAlbum(id) -> #(m, event.emit("play", play_json(id, "album")))
    PlaySong(id) -> #(m, event.emit("play", play_json(id, "song")))
    ChangeTab(tab) -> #(Model(..m, current_tab: tab), effect.none())
    _ -> #(m, effect.none())
  }
}

fn play_json(id: String, type_: String) {
  json.object([#("id", json.string(id)), #("type", json.string(type_))])
}

fn view(m: Model) {
  case m.page_error {
    option.None -> view_real(m)
    option.Some(e) -> error.page(e, event.on_click(ArtistID(m.artist_id)))
  }
}

fn view_real(m: Model) {
  {
    use auth_details <- result.try(
      m.auth_details |> option.to_result(element.none()),
    )
    html.div([components.redirect_click(Nothing), attribute.class("h-full")], [
      html.div(
        [
          attribute.class("relative h-[45%] p-8 flex items-end bg-violet-950"),
          attribute.style("background-position-y", "20%"),
          case option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil)) {
            Ok(artist) ->
              attribute.style(
                "background-image",
                "url('"
                  <> api.cover_url(auth_details, artist.cover_art_id, 500)
                  <> "')",
              )
            Error(_) -> attribute.none()
          },
          attribute.class("bg-cover bg-center"),
        ],
        [
          html.div(
            [
              attribute.class(
                "bg-linear-to-tl md:bg-linear-to-l from-zinc-950 from-30% md:from-10% to-zinc-950/50 absolute top-0 left-0 h-full w-full",
              ),
            ],
            [],
          ),
          html.div(
            [
              attribute.class(
                "z-20 flex items-center justify-between gap-4 w-full",
              ),
            ],
            [
              html.div([], [
                html.h1(
                  [attribute.class("font-extrabold text-4xl sm:text-5xl")],
                  [
                    element.text(
                      case
                        option.to_result(m.artist, Nil)
                        |> result.unwrap(Error(Nil))
                      {
                        Ok(artist) -> artist.name
                        Error(_) -> ""
                      },
                    ),
                  ],
                ),
              ]),
              html.div([attribute.class("flex items-center w-14 h-14")], [
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
                    button.disabled_button(
                      button.Play,
                      button.Custom("text-6xl"),
                      [
                        attribute.class("z-10 text-violet-500"),
                      ],
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
            //tab_element(m, About),
          ],
        ),
        html.div([attribute.class("p-4 flex")], case m.current_tab {
          Home -> view_home(m)
          Albums -> view_albums(m)
          SinglesEPs -> view_singles(m)
          About -> view_about(m)
        }),
      ]),
      components.mobile_space(),
    ])
    |> Ok
  }
  |> result.unwrap_both
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

fn view_home(m: Model) {
  [
    html.div([attribute.class("w-full space-y-4")], [
      html.h1([attribute.class("font-semibold text-xl")], [
        element.text("Most Popular"),
      ]),
      html.div(
        [attribute.class("space-y-4")],
        list.index_map(m.top_songs, fn(song: api_models.Child, index: Int) {
          elements.song(
            song:,
            attrs: [
              attribute.attribute("data-index", index + 1 |> int.to_string),
              event.on_click(PlaySong(song.id)),
            ],
            cover_art: True,
            msg: PlaySong(song.id),
            on_add_queue: #(False, Nothing),
          )
        }),
      ),
    ]),
  ]
}

fn view_albums(m: Model) {
  [
    html.div(
      [attribute.class("flex flex-wrap gap-4")],
      {
        use artist <- result.try(
          option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil)),
        )
        use albums <- result.try(option.to_result(artist.albums, Nil))
        list.map(
          albums
            |> list.filter(fn(album) {
              {
                album.release_types |> list.contains(api_models.Single)
                || album.release_types |> list.contains(api_models.EP)
              }
              |> bool.negate
            }),
          fn(album: api_models.Album) {
            elements.album(album, fn(id) { PlayAlbum(id) })
          },
        )
        |> Ok
      }
        |> result.unwrap([element.none()]),
    ),
  ]
}

fn view_singles(m: Model) {
  [
    html.div(
      [attribute.class("flex flex-wrap gap-4")],
      {
        use artist <- result.try(
          option.to_result(m.artist, Nil) |> result.unwrap(Error(Nil)),
        )
        use albums <- result.try(option.to_result(artist.albums, Nil))
        list.map(
          albums
            |> list.filter(fn(album) {
              album.release_types |> list.contains(api_models.Single)
              || album.release_types |> list.contains(api_models.EP)
            }),
          fn(album: api_models.Album) {
            elements.album(album, fn(id) { PlayAlbum(id) })
          },
        )
        |> Ok
      }
        |> result.unwrap([element.none()]),
    ),
  ]
}

fn view_about(_) {
  [
    html.div([attribute.class("flex gap-8 p-4")], [
      html.div([attribute.class("relative")], [
        html.h1(
          [attribute.class("z-2 text-3xl absolute left-24 top-30 font-bold")],
          [element.text("#1 On Somachord")],
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
