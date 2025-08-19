import gleam/bool
import gleam/dynamic/decode
import gleam/json
import gleam/list
import lustre
import lustre/attribute
import lustre/component
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

import sonata/components

pub type AlbumList {
  AlbumList(type_: String, albums: List(model.Album))
}

pub type Model {
  Model(albumlists: List(AlbumList))
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [component.open_shadow_root(True)])
  lustre.register(app, "home-page")
}

pub fn element(attrs: List(attribute.Attribute(msg.Msg))) {
  element.element(
    "home-page",
    [
      attribute.class(
        "flex-1 p-4 rounded-md border border-zinc-800 overflow-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
      ),
      ..attrs
    ],
    [],
  )
}

fn init(_) {
  let storage = storage.create()

  #(Model(albumlists: []), case storage |> varasto.get("auth") {
    Ok(stg) -> api.album_list(stg.auth, "newest", 0, 9)
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
    [
      components.redirect_click(msg.ComponentClick),
      attribute.class("flex flex-col"),
    ],
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
          [attribute.class("flex overflow-auto -mr-24 gap-3.5")],
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
