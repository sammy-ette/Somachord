import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/list
import gleam/order
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api
import somachord/api_helper
import somachord/elements
import somachord/model
import somachord/models/auth
import somachord/msg
import somachord/storage
import varasto

import somachord/components

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
    Ok(stg) ->
      effect.batch([
        api.album_list(stg.auth, "frequent", 0, 9),
        api.album_list(stg.auth, "newest", 0, 9),
        api.album_list(stg.auth, "random", 0, 9),
      ])
    Error(_) -> effect.none()
  })
}

fn update(m: Model, msg: msg.Msg) {
  case msg {
    msg.SubsonicResponse(Ok(api_helper.AlbumList(type_, list))) -> {
      #(
        Model(
          albumlists: [AlbumList(type_:, albums: list), ..m.albumlists]
          |> list.sort(fn(list1: AlbumList, list2: AlbumList) {
            let list_order = fn(type_: String) -> Int {
              case type_ {
                "frequent" -> 1
                "newest" -> 2
                "random" -> 3
                _ -> 4
              }
            }
            int.compare(list_order(list1.type_), list_order(list2.type_))
          }),
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
      attribute.class("flex flex-col gap-4 overflow-y-auto"),
    ],
    list.map(m.albumlists, fn(album_list) {
      use <- bool.guard(album_list.albums |> list.is_empty, element.none())
      html.div([], [
        html.h1([attribute.class("ml-2 text-2xl font-medium")], [
          element.text(case album_list.type_ {
            "newest" -> "New Additions"
            "frequent" -> "Most Played"
            typ -> typ
          }),
        ]),
        html.div(
          [
            attribute.class(
              "flex overflow-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
            ),
          ],
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
