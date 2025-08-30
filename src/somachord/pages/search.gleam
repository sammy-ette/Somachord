import gleam/json
import gleam/list
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
import somachord/components
import somachord/elements
import somachord/msg
import somachord/storage
import varasto

pub type SearchType {
  All
  Songs
  Albums
  Artists
}

pub type Model {
  Model(
    search_query: String,
    artists: List(api_models.Artist),
    albums: List(api_models.Album),
    songs: List(api_models.Child),
    searching_type: SearchType,
  )
}

pub type Msg {
  Search(String)
  SearchResults(albums: List(api_models.Album), songs: List(api_models.Child))
  PlayAlbum(id: String)
  PlaySong(id: String)
  Nothing
  ChangeSearchType(type_: SearchType)
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.open_shadow_root(True),
      component.on_attribute_change("search-query", fn(value) {
        Ok(value |> Search)
      }),
    ])
  lustre.register(app, "search-page")
}

pub fn query(search: String) {
  attribute.attribute("search-query", search)
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "search-page",
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
      search_query: "",
      artists: [],
      albums: [],
      songs: [],
      searching_type: All,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }
  case msg {
    Search(query) -> #(
      m,
      api.search(auth_details, query)
        |> effect.map(fn(msg: msg.Msg) {
          case msg {
            msg.SubsonicResponse(Ok(api_helper.Search(_, albums, songs))) ->
              SearchResults(albums, songs)
            _ -> {
              Nothing
            }
          }
        }),
    )
    SearchResults(albums, songs) -> #(
      Model(..m, albums:, songs:),
      effect.none(),
    )
    PlayAlbum(id) -> #(
      m,
      event.emit(
        "play",
        json.object([#("id", json.string(id)), #("type", json.string("album"))]),
      ),
    )
    PlaySong(id) -> #(
      m,
      event.emit(
        "play",
        json.object([#("id", json.string(id)), #("type", json.string("song"))]),
      ),
    )
    ChangeSearchType(type_) -> #(
      Model(..m, searching_type: type_),
      effect.none(),
    )
    Nothing -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div([attribute.class("p-4 space-y-3")], [
    html.div(
      [attribute.class("space-x-3")],
      list.map([All, Songs], fn(type_) { filter_btn(m, type_) }),
    ),
    html.div([attribute.class("grid grid-cols-2 grid-rows-2 gap-4")], [
      html.div([attribute.class("space-y-4")], [
        html.h1([attribute.class("font-[Poppins] font-bold text-2xl")], [
          element.text("Songs"),
        ]),
        html.div(
          [attribute.class("space-y-4")],
          list.map(list.take(m.songs, 10), fn(song: api_models.Child) {
            elements.song(song, 0, [], True, msg: PlaySong(song.id))
          }),
        ),
      ]),
      html.div(
        [
          components.redirect_click(Nothing),
          attribute.class("flex flex-wrap"),
        ],
        list.map(m.albums, fn(album: api_models.Album) {
          elements.album(album, fn(id) { PlayAlbum(id) })
        }),
      ),
    ]),
  ])
}

fn filter_btn(m: Model, type_: SearchType) {
  html.button(
    [
      attribute.class("px-4 py-1 rounded-md text-semibold"),
      case m.searching_type == type_ {
        False -> attribute.class("bg-zinc-800/90 text-white")
        True -> attribute.class("bg-white text-black")
      },
      event.on_click(ChangeSearchType(type_)),
    ],
    [
      element.text(case type_ {
        All -> "All"
        Songs -> "Songs"
        _ -> "Unknown"
      }),
    ],
  )
}
