import gleam/bool
import gleam/json
import gleam/list
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import sonata/api
import sonata/api_helper
import sonata/elements
import sonata/model
import sonata/models/auth
import sonata/msg
import sonata/storage
import varasto

pub type AlbumList {
  AlbumList(type_: String, albums: List(model.Album))
}

pub type Model {
  Model(albumlists: List(AlbumList))
}

pub fn register() {
  let app = lustre.component(init, update, view, [])
  lustre.register(app, "home-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "home-page",
    [attribute.class("flex-1 border border-zinc-800 rounded-lg p-4"), ..attrs],
    [],
  )
}

fn init(_) {
  let storage = storage.create()

  #(Model(albumlists: []), case storage |> varasto.get("auth") {
    Ok(stg) -> api.album_list(stg.auth, "newest", 0, 8)
    Error(_) -> effect.none()
  })
}

fn update(m: Model, msg: msg.Msg) {
  case msg {
    msg.SubsonicResponse(Ok(api_helper.AlbumList(type_, list))) -> {
      echo list
      echo type_
      #(
        Model(
          albumlists: [AlbumList(type_:, albums: list), ..m.albumlists]
          |> list.reverse,
        ),
        effect.none(),
      )
    }
    msg.SubsonicResponse(Error(e)) -> {
      echo e
      #(m, effect.none())
    }
    msg.Play(req) -> #(
      m,
      event.emit(
        "play",
        json.object([
          #("id", json.string(req.id)),
          #("type", json.string(req.type_)),
        ]),
      ),
    )
    _ -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div(
    [attribute.class("flex flex-col")],
    list.map(m.albumlists, fn(album_list) {
      use <- bool.guard(album_list.albums |> list.is_empty, element.none())
      html.div([], [
        html.h1([attribute.class("ml-2 text-2xl font-medium")], [
          element.text(case album_list.type_ {
            "newest" -> "New Additions"
            typ -> typ
          }),
        ]),
        html.div(
          [attribute.class("flex flex-wrap overflow-auto gap-4")],
          list.map(album_list.albums, fn(album) {
            elements.album(album, fn(id) {
              msg.Play(model.PlayRequest("album", id))
            })
          }),
        ),
      ])
    }),
  )
}
