import formal/form
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/uri
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import player
import rsvp
import somachord/api/api
import somachord/api/models as api_models
import somachord/elements/button
import somachord/pages/error

import somachord/components
import somachord/constants
import somachord/elements
import somachord/model
import somachord/storage
import varasto

pub type Msg {
  PlaylistID(String)
  CurrentSongID(String)
  PlaylistResponse(
    Result(Result(api_models.Playlist, api.SubsonicError), rsvp.Error),
  )
  LikedSongsResponse(
    Result(Result(List(api_models.Child), api.SubsonicError), rsvp.Error),
  )

  PlayPlaylist(index: Int, shuffle: Bool)

  ShowEditor(Bool)
  PlaylistUpdate(Result(PlaylistForm, form.Form(PlaylistForm)))
  PlaylistUpdateResponse(Result(Result(Nil, api.SubsonicError), rsvp.Error))

  ComponentClick
}

pub type Model {
  Model(
    playlist: api_models.Playlist,
    id: String,
    layout: model.Layout,
    show_editor: Bool,
    playlist_form: form.Form(PlaylistForm),
    current_song_id: String,
    page_error: option.Option(error.ErrorType),
  )
}

pub type PlaylistForm {
  PlaylistForm(name: String, description: String, public: Bool)
}

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.on_attribute_change("playlist-id", fn(value) {
        Ok(value |> PlaylistID)
      }),
      component.on_attribute_change("song-id", fn(value) {
        Ok(value |> CurrentSongID)
      }),
    ])
  lustre.register(app, "playlist-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "playlist-page",
    [
      attribute.class(
        "flex-1 p-8 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700",
      ),
      ..attrs
    ],
    [],
  )
}

fn init(_) {
  #(
    Model(
      playlist: api_models.new_playlist(),
      id: "",
      layout: components.layout(),
      show_editor: False,
      playlist_form: form.new({
        use playlist_name <- form.field(
          "playlistName",
          form.parse_string |> form.check_not_empty,
        )
        use playlist_description <- form.field(
          "playlistDescription",
          form.parse_string,
        )
        use playlist_public <- form.field("playlistPublic", form.parse_checkbox)

        form.success(PlaylistForm(
          name: playlist_name,
          description: playlist_description,
          public: playlist_public,
        ))
      }),
      current_song_id: "",
      page_error: option.None,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    CurrentSongID(id) -> #(Model(..m, current_song_id: id), effect.none())
    PlaylistID(id) -> {
      #(
        Model(..m, id:, page_error: option.None),
        case id == constants.somachord_likes_playlist_id {
          True ->
            api.likes(
              auth_details: {
                let assert Ok(stg) = storage.create() |> varasto.get("auth")
                stg.auth
              },
              msg: LikedSongsResponse,
            )
          False ->
            api.playlist(
              auth_details: {
                let assert Ok(stg) = storage.create() |> varasto.get("auth")
                stg.auth
              },
              id:,
              msg: PlaylistResponse,
            )
        },
      )
    }
    LikedSongsResponse(Ok(Ok(songs))) -> {
      let playlist =
        api_models.Playlist(
          ..api_models.new_playlist(),
          id: constants.somachord_likes_playlist_id,
          name: "Liked Songs",
          owner: "You",
          song_count: list.length(songs),
          duration: list.fold(songs, 0, fn(acc, song) { acc + song.duration }),
          cover_art_id: "",
          public: False,
          songs: songs,
        )
      #(Model(..m, playlist:), effect.none())
    }
    LikedSongsResponse(Ok(res)) -> {
      echo res
      #(m, effect.none())
    }
    LikedSongsResponse(Error(e)) -> {
      echo e
      #(Model(..m, page_error: option.Some(error.from_rsvp(e))), effect.none())
    }
    PlaylistResponse(Ok(Ok(playlist))) -> #(
      Model(..m, playlist:),
      effect.none(),
    )
    PlaylistResponse(Error(e)) -> {
      echo e
      #(Model(..m, page_error: option.Some(error.from_rsvp(e))), effect.none())
    }
    PlaylistResponse(e) -> {
      echo e
      #(m, effect.none())
    }
    PlayPlaylist(index, shuffle) -> {
      echo "playing playlist"
      #(
        m,
        event.emit("playPlaylist", playlist_json(m.playlist, index, shuffle)),
      )
    }
    ShowEditor(show) -> #(Model(..m, show_editor: show), effect.none())
    PlaylistUpdate(Ok(playlist_update_info)) -> {
      #(
        Model(
          ..m,
          playlist_form: m.playlist_form
            |> form.set_values([
              #("playlistName", playlist_update_info.name),
              #("playlistDescription", playlist_update_info.description),
              #("playlistPublic", case playlist_update_info.public {
                True -> "true"
                False -> "false"
              }),
            ]),
        ),
        api.update_playlist(
          auth_details: {
            let assert Ok(stg) = storage.create() |> varasto.get("auth")
            stg.auth
          },
          id: m.playlist.id,
          name: playlist_update_info.name,
          description: playlist_update_info.description,
          public: playlist_update_info.public,
          msg: PlaylistUpdateResponse,
        ),
      )
    }
    PlaylistUpdate(Error(_)) -> {
      echo "form error!"
      // ignore
      #(m, effect.none())
    }
    PlaylistUpdateResponse(Ok(Ok(_))) -> {
      #(
        Model(
          ..m,
          show_editor: False,
          playlist: api_models.Playlist(
            ..m.playlist,
            name: m.playlist_form |> form.field_value("playlistName"),
            public: case m.playlist_form |> form.field_value("playlistPublic") {
              "true" -> True
              _ -> False
            },
          ),
        ),
        effect.none(),
      )
    }
    PlaylistUpdateResponse(e) -> {
      echo e
      #(m, effect.none())
    }
    ComponentClick -> #(m, effect.none())
  }
}

fn playlist_json(playlist: api_models.Playlist, index: Int, shuffle: Bool) {
  json.object([
    #("playlist", api_models.playlist_encode(playlist)),
    #("index", json.int(index)),
    #("shuffle", json.bool(shuffle)),
  ])
}

fn view(m: Model) {
  case m.page_error {
    option.Some(e) -> error.page(e, event.on_click(PlaylistID(m.id)))
    option.None ->
      html.div(
        [
          attribute.class("flex-1 flex gap-4"),
          case m.layout {
            model.Desktop -> attribute.class("overflow-hidden")
            model.Mobile -> attribute.class("flex-col overflow-y-auto")
          },
        ],
        [
          editor(m),
          ..case m.layout, page(m) {
            model.Desktop, elems -> elems
            model.Mobile, elems -> elems |> list.reverse
          }
        ],
      )
  }
}

fn editor(m: Model) {
  let editor_submit = fn(fields) {
    m.playlist_form |> form.add_values(fields) |> form.run |> PlaylistUpdate
  }

  html.div(
    [
      case m.show_editor {
        False -> attribute.class("hidden")
        True -> attribute.none()
      },
      attribute.class(
        "bg-zinc-950/75 z-100 absolute inset-0 flex justify-center items-center",
      ),
    ],
    [
      html.form(
        [
          event.on_submit(editor_submit),
          attribute.class("bg-zinc-900 rounded-md p-4 flex flex-col gap-2"),
        ],
        [
          html.div(
            [
              attribute.class("flex justify-between items-center"),
            ],
            [
              html.h1([attribute.class("text-xl font-black text-white")], [
                element.text("Edit Playlist"),
              ]),
              button.button(button.Close, button.Medium, [
                event.on_click(ShowEditor(False)),
                attribute.class("hover:bg-zinc-600 p-2 rounded-full"),
              ]),
            ],
          ),
          html.div([attribute.class("flex flex-col gap-1")], [
            html.label([attribute.class("text-sm text-zinc-400")], [
              element.text("Playlist Name"),
            ]),
            html.input([
              attribute.class(
                "bg-zinc-800 text-white rounded-md p-2 w-64 focus:outline-none",
              ),
              attribute.value(m.playlist.name),
              attribute.name("playlistName"),
            ]),
          ]),
          html.div([attribute.class("flex flex-col gap-1")], [
            html.label([attribute.class("text-sm text-zinc-400")], [
              element.text("Playlist Description"),
            ]),
            html.textarea(
              [
                attribute.class(
                  "bg-zinc-800 text-white rounded-md p-2 w-64 h-32 focus:outline-none resize-none",
                ),
                attribute.name("playlistDescription"),
              ],
              "",
            ),
          ]),
          html.div([attribute.class("flex flex-col gap-1")], [
            html.div([attribute.class("flex justify-between items-center")], [
              html.label([attribute.class("text-sm text-zinc-400")], [
                element.text("Public Playlist"),
              ]),
              html.label(
                [attribute.class("relative inline-flex cursor-pointer")],
                [
                  html.input([
                    attribute.type_("checkbox"),
                    attribute.class("sr-only peer"),
                    attribute.checked(m.playlist.public),
                    attribute.name("playlistPublic"),
                  ]),
                  html.div(
                    [
                      attribute.class(
                        "w-11 h-6 bg-zinc-800 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-400",
                      ),
                    ],
                    [],
                  ),
                ],
              ),
            ]),
          ]),
          html.button(
            [
              attribute.class(
                "bg-violet-600 text-white rounded-md px-4 py-2 mt-4 hover:bg-violet-700",
              ),
            ],
            [element.text("Save Changes")],
          ),
        ],
      ),
    ],
  )
}

fn page(m: Model) {
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  [
    html.div(
      [
        attribute.class("flex-1 flex flex-col gap-6"),
        case m.layout {
          model.Desktop -> attribute.class("overflow-y-auto pr-4")
          model.Mobile -> attribute.none()
        },
        attribute.class(elements.scrollbar_class),
        components.redirect_click(ComponentClick),
      ],
      [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(m.playlist.name),
        ]),
        html.div(
          [
            attribute.class(
              "flex-wrap flex gap-3 text-xs text-zinc-400 items-center",
            ),
          ],
          [
            html.span([], [
              element.text("by "),
              html.span([attribute.class("text-white")], [
                element.text(m.playlist.owner),
              ]),
            ]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("text-nowrap")], [
              element.text(
                int.to_string(m.playlist.song_count)
                <> " song"
                <> case m.playlist.song_count == 1 {
                  False -> "s"
                  True -> ""
                },
              ),
            ]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("text-nowrap")], [
              element.text({
                let minutes = m.playlist.duration / 60
                let seconds = m.playlist.duration % 60

                int.to_string(minutes)
                <> " min, "
                <> int.to_string(seconds)
                <> " sec"
              }),
            ]),
            ..case m.playlist.public {
              True -> [element.none()]
              False -> [
                html.span([], [element.text("•")]),
                html.i([attribute.class("text-xl ph ph-lock-simple")], []),
              ]
            }
          ],
        ),
        // case m.layout {
        //   model.Mobile ->
        //     html.div(
        //       [attribute.class("flex flex-wrap gap-4")],
        //       list.map(album.genres, elements.tag),
        //     )
        //   model.Desktop -> element.none()
        // },
        buttons(m),
        html.div(
          [attribute.class("flex flex-col gap-4")],
          [
            case m.layout {
              model.Mobile -> components.mobile_space()
              model.Desktop -> element.none()
            },
            ..list.index_map(
              m.playlist.songs,
              fn(song: api_models.Child, index: Int) {
                elements.song(
                  song,
                  attrs: [
                    attribute.attribute(
                      "data-index",
                      index + 1 |> int.to_string,
                    ),
                    case song.id == m.current_song_id {
                      True -> attribute.attribute("data-playing", "")
                      False -> attribute.none()
                    },
                  ],
                  cover_art: True,
                  msg: { PlayPlaylist(index, False) },
                  on_add_queue: #(False, ComponentClick),
                )
              },
            )
            |> list.reverse
          ]
            |> list.reverse,
        ),
        // html.div(
      //   [attribute.class("flex flex-col gap-4")],
      //   [
      //     case m.layout {
      //       model.Mobile -> components.mobile_space()
      //       model.Desktop -> element.none()
      //     },
      //     ..list.index_map(
      //       m.playlist.songs,
      //       fn(song: api_models.Child, index: Int) {
      //         elements.song(
      //           song,
      //           index:,
      //           attrs: case m.layout {
      //             model.Desktop -> [attribute.none()]
      //             model.Mobile -> [
      //               event.on_click(msg.StreamAlbum(album, index)),
      //               attribute.class(
      //                 "transition-all active:scale-[98%] active:bg-zinc-900",
      //               ),
      //             ]
      //           },
      //           cover_art: False,
      //           msg: { msg.StreamAlbum(album, index) },
      //         )
      //       },
      //     )
      //     |> list.reverse
      //   ]
      //     |> list.reverse,
      // ),
      ],
    ),
    html.div([attribute.class("flex flex-col gap-8")], [
      html.div(
        [
          case m.playlist.id == constants.somachord_likes_playlist_id {
            True ->
              attribute.class(
                "bg-linear-to-tl from-violet-500 from-20% to-violet-200",
              )
            False -> attribute.class("bg-zinc-900")
          },
          attribute.class(
            "flex justify-center items-center w-52 h-52 md:w-80 md:h-80 rounded-md",
          ),
        ],
        [
          case m.playlist.id == constants.somachord_likes_playlist_id {
            True ->
              html.i(
                [
                  attribute.class(
                    "text-[12rem] ph-fill ph-heart-straight text-zinc-900",
                  ),
                ],
                [],
              )
            False ->
              case m.playlist.cover_art_id {
                "" ->
                  html.span(
                    [
                      attribute.class("text-4xl p-2 font-black text-zinc-700"),
                    ],
                    [element.text("No Cover Art!")],
                  )
                _ ->
                  html.img([
                    attribute.src(api.cover_url(
                      auth_details,
                      m.playlist.cover_art_id,
                      500,
                    )),
                    attribute.class("object-scale"),
                  ])
              }
          },
        ],
      ),
      //   case m.layout {
    //     model.Mobile -> element.none()
    //     model.Desktop ->
    //       html.div(
    //         [attribute.class("flex flex-wrap gap-4")],
    //         list.map(album.genres, elements.tag),
    //       )
    //   },
    ]),
  ]
}

fn buttons(m: Model) {
  case m.layout {
    model.Desktop ->
      html.div([attribute.class("text-zinc-400 flex gap-4 items-center")], [
        button.button(button.Play, button.Largest, [
          attribute.class("text-violet-500"),
          event.on_click(PlayPlaylist(0, False)),
        ]),
        button.button(button.Shuffle, button.Medium, [
          event.on_click(PlayPlaylist(0, True)),
        ]),
        // html.i(
        //   [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
        //   [],
        // ),
        case m.playlist.id == constants.somachord_likes_playlist_id {
          False ->
            html.i(
              [
                attribute.class("text-3xl ph ph-pencil-simple"),
                event.on_click(ShowEditor(True)),
              ],
              [],
            )
          True -> element.none()
        },
        // html.i(
      //   [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
      //   [],
      // ),
      ])
    model.Mobile ->
      html.div(
        [
          attribute.class(
            "text-zinc-400 flex gap-4 items-center justify-between",
          ),
        ],
        [
          html.div([attribute.class("flex gap-4 items-center")], [
            // html.i(
            //   [attribute.class("text-3xl ph ph-plus-circle cursor-not-allowed")],
            //   [],
            // ),
            button.button(button.Shuffle, button.Medium, [
              event.on_click(PlayPlaylist(0, True)),
            ]),
            button.button(button.Play, button.Largest, [
              attribute.class("text-violet-500"),
              event.on_click(PlayPlaylist(0, False)),
            ]),
          ]),
          html.div([], []),
          // html.i(
        //   [attribute.class("text-3xl ph ph-dots-three cursor-not-allowed")],
        //   [],
        // ),
        ]
          |> list.reverse,
      )
  }
}
