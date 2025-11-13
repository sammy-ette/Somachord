import gleam/bool
import gleam/dict
import gleam/list
import gleam/string
import gleam/uri
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api_helper
import somachord/api_models
import somachord/storage
import varasto

type Model {
  Model(
    playlists: dict.Dict(String, api_models.Playlist),
    song: api_models.Child,
    open: Bool,
  )
}

type Msg {
  NewPlaylist
  AddToPlaylist(playlist_id: String)
  RemoveFromPlaylist(playlist_id: String)
}

pub fn register() {
  let component = lustre.component(init, update, view, [])
  lustre.register(component, "playlist-menu")
}

//attribute.class("absolute bottom-92 right-96")
pub fn element(
  button_attrs button_attrs: List(attribute.Attribute(msg)),
  menu_attrs menu_attrs: List(attribute.Attribute(msg)),
) {
  html.div([attribute.class("relative inline-block group")], [
    html.button(button_attrs, [
      html.i(
        [
          attribute.class("text-3xl ph ph-plus-circle"),
        ],
        [],
      ),
    ]),
    element.element(
      "playlist-menu",
      [attribute.class("not-group-focus-within:hidden"), ..menu_attrs],
      [],
    ),
    // html.div(
  //   [
  //     attribute.class(
  //       "fixed w-56 h-56 mt-2 bg-white border border-gray-200 rounded-md z-100",
  //     ),
  //   ],
  //   [],
  // ),
  ])
}

pub fn song_id(id: String) {
  attribute.attribute("song-id", id)
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(Model(dict.new(), api_models.new_song(), True), effect.none())
}

fn update(m: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    NewPlaylist -> #(m, effect.none())
    AddToPlaylist(playlist_id) -> #(m, effect.none())
    RemoveFromPlaylist(playlist_id) -> #(m, effect.none())
  }
}

fn view(m: Model) {
  html.div(
    [
      attribute.class(
        "z-100 absolute flex flex-col gap-2 rounded-lg bg-zinc-900 w-96 h-80 p-4",
      ),
    ],
    [
      html.div([attribute.class("inline-flex justify-between")], [
        html.h1([attribute.class("font-semibold text-lg")], [
          element.text("Add to playlist"),
        ]),
        html.div(
          [
            event.on_click(NewPlaylist),
            attribute.class(
              "p-1 bg-white hover:bg-white/80 active:scale-[95%] transition-scale duration-200 cursor-pointer text-black font-medium rounded-md w-fit",
            ),
          ],
          [
            element.text("New Playlist"),
          ],
        ),
      ]),
      html.div(
        [
          attribute.class(
            "flex flex-col gap-2 pt-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
          ),
        ],
        list.map(
          m.playlists
            |> dict.to_list
            |> list.sort(fn(pl1, pl2) {
              string.compare({ pl1.1 }.name, { pl2.1 }.name)
            }),
          fn(playlist) {
            let song_in_playlist = { playlist.1 }.songs |> list.contains(m.song)

            html.div(
              [
                attribute.class(
                  "hover:bg-zinc-800 px-2 py-1 rounded cursor-pointer inline-flex items-center gap-2",
                ),
              ],
              [
                html.img([
                  attribute.src(
                    api_helper.create_uri(
                      "/rest/getCoverArt.view",
                      {
                        let assert Ok(stg) =
                          storage.create() |> varasto.get("auth")
                        stg.auth
                      },
                      [
                        #("id", playlist.0),
                        #("size", "500"),
                      ],
                    )
                    |> uri.to_string,
                  ),
                  attribute.class("w-12 h-12 rounded object-cover inline-block"),
                ]),
                html.span(
                  [
                    attribute.class(
                      "font-normal inline-flex w-full items-center justify-between",
                    ),
                  ],
                  [
                    html.a(
                      [
                        attribute.href("/playlist/" <> { playlist.1 }.id),
                        attribute.class("hover:underline"),
                      ],
                      [
                        element.text({ playlist.1 }.name),
                      ],
                    ),
                    html.i(
                      [
                        attribute.class("text-2xl"),
                        event.on_click(case song_in_playlist {
                          True -> RemoveFromPlaylist(playlist.0)
                          False -> AddToPlaylist(playlist.0)
                        }),
                        case song_in_playlist {
                          True ->
                            attribute.class(
                              "text-violet-500 ph-fill ph-check-circle",
                            )
                          False -> attribute.class("ph ph-plus-circle")
                        },
                      ],
                      [],
                    ),
                  ],
                ),
              ],
            )
          },
        ),
      ),
    ],
  )
}
