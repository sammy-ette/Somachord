import gleam/bool
import gleam/dict
import gleam/list
import gleam/pair
import gleam/string
import gleam/uri
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

import somachord/storage
import varasto

type Model {
  Model(
    playlists: dict.Dict(String, api_models.Playlist),
    added_songs: dict.Dict(String, List(String)),
    song_id: String,
    open: Bool,
  )
}

type Msg {
  SongID(id: String)

  NewPlaylist
  AddToPlaylist(playlist_id: String)
  RemoveFromPlaylist(playlist_id: String)

  Playlists(
    Result(Result(List(api_models.Playlist), api.SubsonicError), rsvp.Error),
  )
  PlaylistWithSongs(
    Result(Result(api_models.Playlist, api.SubsonicError), rsvp.Error),
  )
  CreatePlaylist(
    Result(Result(api_models.Playlist, api.SubsonicError), rsvp.Error),
  )
  DisgardedResponse(Result(Result(Nil, api.SubsonicError), rsvp.Error))
}

pub fn register() {
  let component =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(id) { Ok(id |> SongID) }),
    ])
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
  #(
    Model(dict.new(), dict.new(), "", True),
    case storage.create() |> varasto.get("auth") {
      Ok(stg) -> api.playlists(stg.auth, Playlists)
      Error(_) -> effect.none()
    },
  )
}

fn update(m: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    SongID(id) -> #(Model(..m, song_id: id), effect.none())
    NewPlaylist -> {
      let auth_details = {
        let assert Ok(stg) = storage.create() |> varasto.get("auth")
        stg.auth
      }
      #(
        m,
        api.create_playlist(
          auth_details:,
          name: "New Playlist",
          songs: [m.song_id],
          msg: CreatePlaylist,
        ),
      )
    }
    CreatePlaylist(Ok(Ok(playlist))) -> {
      #(
        Model(..m, playlists: m.playlists |> dict.insert(playlist.id, playlist)),
        effect.none(),
      )
    }
    CreatePlaylist(e) -> {
      echo e
      #(m, effect.none())
    }
    AddToPlaylist(playlist_id) -> {
      let auth_details = {
        let assert Ok(stg) = storage.create() |> varasto.get("auth")
        stg.auth
      }

      let added_songs = case dict.get(m.added_songs, playlist_id) {
        Error(_) -> m.added_songs |> dict.insert(playlist_id, [m.song_id])
        Ok(songs) ->
          m.added_songs
          |> dict.insert(playlist_id, songs |> list.append([m.song_id]))
      }

      #(
        Model(..m, added_songs:),
        api.add_to_playlist(
          auth_details:,
          playlist_id:,
          song_id: m.song_id,
          msg: DisgardedResponse,
        ),
      )
    }
    RemoveFromPlaylist(playlist_id) -> {
      let auth_details = {
        let assert Ok(stg) = storage.create() |> varasto.get("auth")
        stg.auth
      }

      let added_songs = case dict.get(m.added_songs, playlist_id) {
        Error(_) -> m.added_songs |> dict.insert(playlist_id, [m.song_id])
        Ok(songs) ->
          m.added_songs
          |> dict.insert(playlist_id, songs |> list.append([m.song_id]))
      }

      #(
        Model(..m, added_songs:),
        api.remove_from_playlist(
          auth_details:,
          playlist_id:,
          song_id: m.song_id,
          msg: DisgardedResponse,
        ),
      )
    }
    Playlists(Ok(Ok(playlists))) -> #(
      Model(
        ..m,
        playlists: playlists
          |> list.fold(#(dict.new(), ""), fn(acc, song) {
            let #(d, idx) = acc
            #(d |> dict.insert(idx, song), idx)
          })
          |> pair.first
          |> dict.delete(""),
      ),
      list.map(playlists, fn(playlist: api_models.Playlist) {
        api.playlist(
          {
            let assert Ok(stg) = storage.create() |> varasto.get("auth")
            stg.auth
          },
          playlist.id,
          PlaylistWithSongs,
        )
      })
        |> effect.batch(),
    )
    Playlists(e) -> {
      echo e
      #(m, effect.none())
    }
    PlaylistWithSongs(Ok(Ok(playlist))) -> {
      #(
        Model(..m, playlists: m.playlists |> dict.insert(playlist.id, playlist)),
        effect.none(),
      )
    }
    PlaylistWithSongs(e) -> {
      echo e
      #(m, effect.none())
    }
    DisgardedResponse(_) -> #(m, effect.none())
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
        html.button(
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
            let song_in_playlist = case dict.get(m.added_songs, playlist.0) {
              Error(_) ->
                list.map({ playlist.1 }.songs, fn(song) { song.id })
                |> list.contains(m.song_id)
              Ok(songs) -> songs |> list.contains(m.song_id)
            }

            html.div(
              [
                attribute.class(
                  "hover:bg-zinc-800 px-2 py-1 rounded cursor-pointer inline-flex items-center gap-2",
                ),
              ],
              [
                html.img([
                  attribute.src(api.cover_url(
                    {
                      let assert Ok(stg) =
                        storage.create() |> varasto.get("auth")
                      stg.auth
                    },
                    playlist.0,
                    500,
                  )),
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
                    html.button([], [
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
                    ]),
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
