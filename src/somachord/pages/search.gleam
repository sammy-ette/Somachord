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

pub type Model {
  Model(
    search_query: String,
    artists: List(api_models.Artist),
    albums: List(api_models.Album),
  )
}

pub type Msg {
  Search(String)
  SearchResults(albums: List(api_models.Album))
  PlayAlbum(id: String)
  Nothing
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
  #(Model(search_query: "", artists: [], albums: []), effect.none())
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
          echo query
          case msg {
            msg.SubsonicResponse(Ok(api_helper.Search(_, albums, _))) ->
              SearchResults(albums)
            _ -> {
              echo msg
              Nothing
            }
          }
        }),
    )
    SearchResults(albums) -> #(Model(..m, albums:), effect.none())
    PlayAlbum(id) -> #(
      m,
      event.emit(
        "play",
        json.object([#("id", json.string(id)), #("type", json.string("album"))]),
      ),
    )
    Nothing -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div(
    [
      components.redirect_click(Nothing),
      attribute.class("grid auto-cols-max grid-flow-col"),
    ],
    list.map(m.albums, fn(album: api_models.Album) {
      elements.album(album, fn(id) { PlayAlbum(id) })
    }),
  )
}
