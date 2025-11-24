import gleam/bool
import gleam/int
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
import somachord/elements
import somachord/model
import somachord/msg
import somachord/storage
import varasto

import somachord/components

pub type AlbumList {
  AlbumList(type_: String, albums: List(api_models.Album))
}

pub type Model {
  Model(albumlists: List(AlbumList))
}

pub type Msg {
  AlbumListRetrieved(
    Result(Result(api.AlbumList, api.SubsonicError), rsvp.Error),
  )
  Play(model.PlayRequest)
  ComponentClick
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
      case components.layout() {
        model.Desktop -> attribute.class("border")
        model.Mobile -> attribute.none()
      },
      attribute.class(
        "flex-1 p-4 rounded-md border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
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
        api.album_list(stg.auth, "frequent", 0, 11, AlbumListRetrieved),
        api.album_list(stg.auth, "newest", 0, 11, AlbumListRetrieved),
        api.album_list(stg.auth, "random", 0, 11, AlbumListRetrieved),
      ])
    Error(_) -> effect.none()
  })
}

fn update(m: Model, msg: Msg) {
  case msg {
    AlbumListRetrieved(Ok(Ok(api.AlbumList(type_, list)))) -> {
      #(
        Model(
          albumlists: [AlbumList(type_:, albums: list), ..m.albumlists]
          |> list.sort(fn(list1: AlbumList, list2: AlbumList) {
            let list_order = fn(type_: String) -> Int {
              case type_ {
                "frequent" -> 4
                "newest" -> 3
                "random" -> 2
                _ -> 1
              }
            }
            int.compare(list_order(list1.type_), list_order(list2.type_))
          }),
        ),
        effect.none(),
      )
    }
    AlbumListRetrieved(Ok(Error(e))) -> {
      echo "subsonic error"
      echo e
      #(m, effect.none())
    }
    AlbumListRetrieved(Error(e)) -> {
      echo "rsvp error"
      echo e
      #(m, effect.none())
    }
    Play(req) -> #(
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
      components.redirect_click(ComponentClick),
      attribute.class("flex flex-col gap-4 overflow-y-auto"),
    ],
    [
      case components.layout() {
        model.Desktop -> element.none()
        model.Mobile -> components.mobile_space()
      },
      ..list.map(m.albumlists, fn(album_list) {
        use <- bool.guard(album_list.albums |> list.is_empty, element.none())
        html.div([], [
          html.h1([attribute.class("sticky ml-2 text-2xl font-medium")], [
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
                Play(model.PlayRequest("album", id, 0))
              })
            }),
          ),
        ])
      })
    ]
      |> list.reverse,
  )
}
