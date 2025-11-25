import gleam/bool
import gleam/json
import gleam/list
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import rsvp
import somachord/api/api
import somachord/api/models as api_models
import somachord/components
import somachord/elements
import somachord/model
import somachord/pages/error
import somachord/storage
import varasto

pub type Model {
  Model(
    search_query: String,
    artists: List(api_models.Artist),
    albums: List(api_models.Album),
    layout: model.Layout,
    failed: Bool,
  )
}

pub type Msg {
  Search(String)
  SearchResults(Result(Result(api.Search, api.SubsonicError), rsvp.Error))
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
        "flex-1 p-4 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
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
      layout: components.layout(),
      failed: False,
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
      Model(..m, search_query: query),
      api.search(auth_details, query, SearchResults),
    )
    SearchResults(Ok(Ok(api.Search(_, albums)))) -> #(
      Model(..m, albums:),
      effect.none(),
    )
    SearchResults(Ok(Error(e))) -> {
      echo e
      panic as "search results subsonic error"
    }
    SearchResults(Error(e)) -> {
      echo e
      #(Model(..m, failed: True), effect.none())
    }
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
  case components.online() || m.failed |> bool.negate {
    False ->
      error.page(error.NoConnection, event.on_click(Search(m.search_query)))
    True ->
      html.div([attribute.class("flex flex-col")], [
        case m.layout {
          model.Desktop -> element.none()
          model.Mobile ->
            html.input([
              attribute.class(
                "text-zinc-500 bg-zinc-900 p-2 rounded-sm w-full focus:outline-none outline-none ring-0",
              ),
              attribute.placeholder("Search"),
              //attribute.value(query),
              attribute.autofocus(True),
              event.on_input(Search),
            ])
        },
        html.div(
          [
            components.redirect_click(Nothing),
            attribute.class("flex flex-wrap gap-4"),
          ],
          list.map(m.albums, fn(album: api_models.Album) {
            elements.album(album, fn(id) { PlayAlbum(id) })
          }),
        ),
      ])
  }
}
