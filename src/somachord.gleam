import gleam/bool
import gleam/dict
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import gleam/pair
import gleam/result
import gleam/uri
import plinth/javascript/date
import plinth/javascript/global
import somachord/components
import somachord/components/fullscreen_player
import somachord/components/lyrics
import somachord/components/playlist_menu
import somachord/constants
import somachord/models/auth
import somachord/pages/about
import somachord/pages/error
import somachord/pages/library
import somachord/pages/loading
import somachord/pages/playlist
import somachord/pages/search
import somachord/queue
import vibrant

import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import modem
import plinth/browser/element as browser_element
import plinth/browser/event
import plinth/browser/window
import varasto

import player
import somachord/api/api
import somachord/api/models as api_models

import somachord/components/login
import somachord/model
import somachord/msg
import somachord/pages/album
import somachord/pages/artist
import somachord/pages/home
import somachord/pages/song
import somachord/pages/views/desktop
import somachord/pages/views/mobile
import somachord/router
import somachord/storage

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = playlist_menu.register()
  let assert Ok(_) = lyrics.register()

  let assert Ok(_) = login.register()
  let assert Ok(_) = home.register()
  let assert Ok(_) = artist.register()
  let assert Ok(_) = song.register()
  let assert Ok(_) = search.register()
  let assert Ok(_) = playlist.register()
  let assert Ok(_) = library.register()
  let assert Ok(_) = lustre.start(app, "#app", 0)
}

fn init(_) {
  let route =
    modem.initial_uri()
    |> fn(uri) {
      case uri {
        Ok(a) -> router.uri_to_route(a)
        _ -> router.Home
      }
    }

  let layout = components.layout()

  let m =
    model.Model(
      route:,
      layout:,
      online: True,
      storage: storage.create(),
      auth: auth.Auth("", auth.Credentials("", ""), ""),
      confirmed: False,
      albums: dict.new(),
      player: player.new(),
      queue: queue.empty(),
      current_song: api_models.new_song(),
      seeking: False,
      seek_amount: 0,
      played_seconds: 0,
      shuffled: False,
      looping: False,
      playlists: dict.new(),
      fullscreen_player_open: False,
      fullscreen_player_display: model.Default,
      current_palette: model.Palette(True),
      toast_display: option.None,
    )
  case m.storage |> varasto.get("auth") {
    Ok(stg) -> #(
      model.Model(..m, confirmed: True, auth: stg.auth),
      effect.batch([
        modem.init(msg.on_url_change),
        route_effect(m, m.route),
        player.listen_events(m.player, player_event_handler),
        api.queue(
          {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          msg.Queue,
        ),
        unload_event(),
        online_event(),
        offline_event(),
        keydown_event(),
      ]),
    )
    Error(_) ->
      case echo router.get_route() |> router.uri_to_route {
        router.Login -> #(
          model.Model(..m, confirmed: True),
          modem.init(msg.on_url_change),
        )
        _ -> {
          #(
            model.Model(..m, confirmed: True, route: router.Login),
            effect.none(),
          )
        }
      }
  }
}

fn route_effect(m: model.Model, route: router.Route) {
  case route {
    router.Album(id) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      api.album(auth_details, id, msg.AlbumRetrieved)
    }
    _ -> effect.none()
  }
}

fn unload_event() {
  effect.from(fn(dispatch) {
    window.add_event_listener("beforeunload", fn(_event) {
      msg.Unload |> dispatch
    })
  })
}

fn offline_event() {
  effect.from(fn(dispatch) {
    window.add_event_listener("offline", fn(_event) {
      msg.Connectivity(False) |> dispatch
    })
  })
}

fn online_event() {
  effect.from(fn(dispatch) {
    window.add_event_listener("online", fn(_event) {
      msg.Connectivity(True) |> dispatch
    })
  })
}

fn keybind_msg(key: String, ctrl_or_meta: Bool) -> option.Option(msg.Msg) {
  case key, ctrl_or_meta {
    "Escape", False -> option.Some(msg.HideFullscreenPlayer)
    " ", False -> option.Some(msg.PlayerPausePlay)
    "ArrowLeft", True -> option.Some(msg.PlayerPrevious)
    "ArrowRight", True -> option.Some(msg.PlayerNext)
    "s", False -> option.Some(msg.PlayerShuffle)
    "r", False -> option.Some(msg.PlayerLoop)
    "f", False -> option.Some(msg.Like)
    "m", False -> option.Some(msg.PlayerMute)
    _, _ -> option.None
  }
}

fn keydown_event() {
  effect.from(fn(dispatch) {
    window.add_event_listener("keydown", fn(kb_event) {
      let in_editable =
        kb_event
        |> event.target
        |> browser_element.cast
        |> result.map(fn(el) {
          browser_element.closest(
            el,
            "input, textarea, select, [contenteditable]",
          )
          |> result.is_ok
        })
        |> result.unwrap(False)

      use <- bool.guard(in_editable, Nil)

      let ctrl_or_meta = event.ctrl_key(kb_event) || event.meta_key(kb_event)
      case keybind_msg(event.key(kb_event), ctrl_or_meta) {
        option.Some(m) -> {
          event.prevent_default(kb_event)
          dispatch(m)
        }
        option.None -> Nil
      }
    })
  })
}

fn clear_toast_timeout() {
  effect.from(fn(dispatch) {
    global.set_timeout(5000, fn() { msg.ClearToast |> dispatch })
    Nil
  })
}

fn update(
  m: model.Model,
  msg: msg.Msg,
) -> #(model.Model, effect.Effect(msg.Msg)) {
  case msg {
    msg.Router(router.ChangeRoute(route)) -> #(
      model.Model(..m, route:),
      route_effect(m, route),
    )
    msg.Connectivity(online) -> #(model.Model(..m, online:), effect.none())
    msg.DisplayToast(toast) -> #(
      model.Model(..m, toast_display: option.Some(toast)),
      clear_toast_timeout(),
    )
    msg.ClearToast -> #(
      model.Model(..m, toast_display: option.None),
      effect.none(),
    )
    msg.AlbumRetrieved(Ok(Ok(album))) -> #(
      model.Model(..m, albums: m.albums |> dict.insert(album.id, album)),
      effect.none(),
    )
    msg.AlbumRetrieved(Ok(Error(_))) -> todo as "album not found"
    msg.AlbumRetrieved(Error(_)) -> todo as "album not found: rsvp"
    msg.Queue(Ok(Ok(queue))) -> {
      // we dont want to use the queue if its older than 2 hours
      let queue_time_range = date.get_time(date.now()) - { 2 * 60 * 60 * 1000 }
      #(
        model.Model(..m, queue: queue),
        case queue.changed |> date.get_time() < queue_time_range {
          True ->
            api.save_queue(
              {
                let assert Ok(stg) = m.storage |> varasto.get("auth")
                stg.auth
              },
              option.None,
              msg.DisgardedResponse,
            )
          False -> {
            m.player
            |> player.seek(queue.song_position)
            load()
          }
        },
      )
    }
    msg.Queue(_) -> #(m, effect.none())
    msg.Unload -> #(
      m,
      api.save_queue(
        {
          let assert Ok(stg) = m.storage |> varasto.get("auth")
          stg.auth
        },
        option.Some(
          queue.Queue(..m.queue, song_position: m.player |> player.time),
        ),
        msg.DisgardedResponse,
      ),
    )
    msg.Play(req) -> {
      echo "!!! play request id: " <> req.id
      echo "play request type: " <> req.type_
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      case req.type_ {
        "album" -> {
          use <- bool.guard(m.albums |> dict.has_key(req.id), #(
            m,
            effect.from(fn(dispatch) {
              let assert Ok(album) = m.albums |> dict.get(req.id)
              msg.StreamAlbum(album, 0) |> dispatch
            }),
          ))
          #(
            m,
            api.album(auth_details:, id: req.id, msg: msg.AlbumRetrieved)
              |> effect.map(fn(msg) {
                case msg {
                  msg.AlbumRetrieved(Ok(Ok(album))) -> msg.StreamAlbum(album, 0)
                  msg.AlbumRetrieved(Ok(Error(e))) -> {
                    echo e
                    panic as "album subsonic err"
                  }
                  msg.AlbumRetrieved(Error(e)) -> {
                    echo e
                    msg.DisplayToast(model.Toast(
                      "Unable to request album",
                      "warning",
                    ))
                  }
                  _ -> panic as "unreachable"
                }
              }),
          )
        }
        "playlist" -> {
          use <- bool.guard(m.playlists |> dict.has_key(req.id), #(
            m,
            effect.from(fn(dispatch) {
              let assert Ok(playlist) = m.playlists |> dict.get(req.id)
              msg.StreamPlaylist(playlist, req.index) |> dispatch
            }),
          ))
          #(
            m,
            api.playlist(auth_details:, id: req.id, msg: msg.PlaylistWithSongs)
              |> effect.map(fn(msg) {
                case msg {
                  msg.PlaylistWithSongs(Ok(Ok(playlist))) ->
                    msg.StreamPlaylist(playlist, req.index)
                  msg.PlaylistWithSongs(Ok(Error(e))) -> {
                    echo e
                    panic as "playlist subsonic err"
                  }
                  msg.PlaylistWithSongs(Error(e)) -> {
                    echo e
                    panic as "playlist req fetch failed"
                  }
                  _ -> panic as "unreachable"
                }
              }),
          )
        }
        "song" -> #(
          m,
          api.song(auth_details:, id: req.id, msg: msg.SongRetrieval),
        )
        _ -> #(m, effect.none())
      }
    }
    msg.StreamAlbum(album, index) -> {
      let queue =
        case m.shuffled, queue.new(songs: album.songs, song_position: 0.0) {
          True, queue -> queue |> queue.shuffle
          False, queue -> queue
        }
        |> queue.jump(index)
      #(model.Model(..m, queue:), play())
    }
    msg.StreamPlaylist(playlist, index) -> {
      echo playlist.name
      let queue =
        case m.shuffled, queue.new(songs: playlist.songs, song_position: 0.0) {
          True, queue -> queue |> queue.shuffle
          False, queue -> queue
        }
        |> queue.jump(index)
      #(model.Model(..m, queue:), play())
    }
    msg.StreamAlbumShuffled(album, index) -> {
      let queue =
        queue.new(songs: album.songs, song_position: 0.0)
        |> queue.shuffle
        |> queue.jump(index)
      #(model.Model(..m, queue:, shuffled: True), play())
    }
    msg.StreamSong(song) | msg.SongRetrieval(Ok(Ok(song))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let stream_uri = api.stream(auth_details, song)

      m.player |> player.load_song(stream_uri, song)
      #(
        model.Model(..m, queue: queue.new(songs: [song], song_position: 0.0)),
        play(),
      )
    }
    msg.StreamError | msg.SongRetrieval(_) -> todo as "handle stream error"
    msg.PlayerTick(time) -> {
      let playtime = case time <. 1.0 {
        True -> 0
        False ->
          case
            float.absolute_value(time -. int.to_float(m.played_seconds)) >. 1.0
          {
            True -> m.played_seconds + 1
            False -> m.played_seconds
          }
      }
      #(model.Model(..m, played_seconds: playtime), case playtime {
        0 -> check_scrobble(m)
        _ -> effect.none()
      })
    }
    msg.PlayerSongLoaded(song) -> {
      #(
        model.Model(..m, current_song: song, played_seconds: 0),
        api.scrobble(
          {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          id: song.id,
          submission: False,
          msg: msg.DisgardedResponse,
        ),
      )
    }
    msg.PlayerShuffle -> {
      #(
        model.Model(
          ..m,
          queue: case m.shuffled {
            False -> queue.shuffle(m.queue)
            True -> queue.unshuffle(m.queue)
          },
          shuffled: bool.negate(m.shuffled),
        ),
        effect.none(),
      )
    }
    msg.PlayerPrevious ->
      case list.is_empty(m.queue.played), m.player |> player.time() >. 2.0 {
        False, False -> #(
          model.Model(..m, queue: queue.previous(m.queue)),
          play(),
        )
        _, True -> {
          m.player |> player.beginning()
          #(m, effect.none())
        }
        _, _ -> #(m, effect.none())
      }
    msg.MusicEnded | msg.PlayerNext -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let new_queue = queue.next(m.queue)
      #(
        model.Model(..m, queue: new_queue),
        effect.batch([
          check_scrobble(m),
          case list.is_empty(new_queue.unplayed) {
            False -> play()
            True ->
              api.similar_songs(
                auth_details,
                m.current_song.id,
                msg: msg.SimilarSongs,
              )
          },
        ]),
      )
    }
    msg.SimilarSongs(Ok(Ok(songs))) | msg.SimilarSongsArtist(Ok(Ok(songs))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let new_queue = m.queue |> queue.append_songs(songs)
      #(
        model.Model(..m, queue: new_queue),
        case list.is_empty(new_queue.unplayed) {
          False -> play()
          True -> {
            let assert Ok(first_artist) = m.current_song.artists |> list.first
            api.similar_songs_artist(
              auth_details,
              first_artist.id,
              msg: msg.SimilarSongs,
            )
          }
        },
      )
    }
    msg.SimilarSongs(Ok(Error(_))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let assert Ok(first_artist) = m.current_song.artists |> list.first
      #(
        m,
        api.similar_songs_artist(
          auth_details,
          first_artist.id,
          msg: msg.SimilarSongsArtist,
        ),
      )
    }
    msg.SimilarSongs(_) | msg.SimilarSongsArtist(_) -> #(m, effect.none())
    msg.LoadSong -> {
      case queue.current_song(m.queue) {
        option.None -> #(m, effect.none())
        option.Some(song) -> {
          let stream_uri = api.stream(m.auth, song)
          m.player |> player.load_song(stream_uri, song)
          case song.cover_art_id {
            "" -> #(
              model.Model(..m, current_palette: model.Palette(empty: True)),
              effect.none(),
            )
            _ -> #(
              model.Model(..m, current_song: song),
              vibrant.palette(
                api.cover_url(m.auth, song.cover_art_id, 500),
                fn(res) {
                  case res {
                    Ok(palette) -> msg.CurrentSongPalette(palette)
                    Error(e) -> {
                      echo msg.DisgardedResponse(Ok(Ok(Nil)))
                    }
                  }
                },
              ),
            )
          }
        }
      }
    }
    msg.StreamCurrent -> {
      case queue.current_song(m.queue) {
        option.None -> #(m, effect.none())
        option.Some(song) -> {
          let stream_uri = api.stream(m.auth, song)
          m.player |> player.load_song(stream_uri, song)
          m.player |> player.toggle_play()

          let save_queue =
            api.save_queue(m.auth, option.Some(m.queue), msg.DisgardedResponse)
          case song.cover_art_id {
            "" -> #(
              model.Model(
                ..m,
                current_song: song,
                current_palette: model.Palette(empty: True),
              ),
              save_queue,
            )
            _ -> #(
              model.Model(..m, current_song: song),
              effect.batch([
                save_queue,
                vibrant.palette(
                  api.cover_url(m.auth, song.cover_art_id, 500),
                  fn(res) {
                    case res {
                      Ok(palette) -> msg.CurrentSongPalette(palette)
                      Error(e) -> {
                        echo msg.DisgardedResponse(Ok(Ok(Nil)))
                      }
                    }
                  },
                ),
              ]),
            )
          }
        }
      }
    }
    msg.QueueJumpTo(position) -> #(
      model.Model(..m, queue: m.queue |> queue.jump(position)),
      play(),
    )
    msg.StreamFromQueue(position) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let queue = m.queue |> queue.jump(position)
      let assert option.Some(song) = queue.current_song(queue)
      let stream_uri = api.stream(m.auth, song)
      m.player |> player.load_song(stream_uri, song)
      #(
        model.Model(..m, queue:),
        api.save_queue(auth_details, option.Some(queue), msg.DisgardedResponse),
      )
    }
    msg.PlayerPausePlay -> {
      m.player |> player.toggle_play()
      #(
        m,
        api.save_queue(
          {
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          option.Some(
            queue.Queue(..m.queue, song_position: m.player |> player.time),
          ),
          msg.DisgardedResponse,
        ),
      )
    }
    msg.ProgressDrag(amount) -> #(
      model.Model(..m, seek_amount: amount, seeking: True),
      effect.none(),
    )
    msg.PlayerSeek(amount) -> {
      m.player |> player.seek(amount)
      #(model.Model(..m, seeking: False), effect.none())
    }
    msg.PlayerVolume(amount) -> {
      m.player |> player.volume(amount)
      #(m, effect.none())
    }
    msg.PlayerLoop -> {
      m.player |> player.loop(bool.negate(m.looping))
      #(model.Model(..m, looping: bool.negate(m.looping)), effect.none())
    }
    msg.PlayerMute -> {
      m.player |> player.toggle_mute
      #(m, effect.none())
    }
    msg.Like -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let updated_song =
        api_models.Child(
          ..m.current_song,
          starred: bool.negate(m.current_song.starred),
        )
      #(
        model.Model(
          ..m,
          current_song: updated_song,
          queue: queue.Queue(
            ..m.queue,
            current: m.queue.current
              |> option.map(fn(c) { #(c.0, updated_song) }),
          ),
        ),
        case m.current_song.starred {
          False ->
            api.like(
              auth_details,
              m.current_song.id,
              msg: msg.DisgardedResponse,
            )
          True ->
            api.unlike(
              auth_details,
              m.current_song.id,
              msg: msg.DisgardedResponse,
            )
        },
      )
    }
    msg.PlaylistWithSongs(Ok(Ok(playlist))) -> {
      echo playlist.name
      echo playlist.songs
      echo m.current_song
      #(
        model.Model(
          ..m,
          playlists: m.playlists |> dict.insert(playlist.id, playlist),
        ),
        effect.none(),
      )
    }
    msg.PlaylistWithSongs(e) -> {
      echo e
      #(m, effect.none())
    }
    msg.Search(query) -> #(
      m,
      modem.push("/search/" <> query, option.None, option.None),
    )
    msg.ToggleFullscreenPlayer -> #(
      model.Model(
        ..m,
        fullscreen_player_open: bool.negate(m.fullscreen_player_open),
      ),
      effect.none(),
    )
    msg.HideFullscreenPlayer -> #(
      model.Model(..m, fullscreen_player_open: False),
      effect.none(),
    )
    msg.ChangeFullscreenPlayerView(view) -> #(
      model.Model(..m, fullscreen_player_display: view),
      effect.none(),
    )
    msg.CurrentSongPalette(palette) -> #(
      model.Model(..m, current_palette: echo palette),
      effect.none(),
    )
    msg.ComponentClick | msg.DisgardedResponse(_) -> #(m, effect.none())
  }
}

fn check_scrobble(m: model.Model) {
  case m.played_seconds > m.current_song.duration / 2 {
    True ->
      api.scrobble(
        {
          let assert Ok(stg) = m.storage |> varasto.get("auth")
          stg.auth
        },
        id: m.current_song.id,
        submission: True,
        msg: msg.DisgardedResponse,
      )
    False -> effect.none()
  }
}

fn play_from_queue(position: Int) {
  effect.from(fn(dispatch) { msg.StreamFromQueue(position) |> dispatch })
}

fn play() {
  effect.from(fn(dispatch) { msg.StreamCurrent |> dispatch })
}

fn load() {
  effect.from(fn(dispatch) { msg.LoadSong |> dispatch })
}

fn player_event_handler(event: String, player: model.Player) -> msg.Msg {
  case event {
    "loaded" -> msg.PlayerSongLoaded(player |> player.current())
    "time" -> msg.PlayerTick(player |> player.time())
    "previous" -> msg.PlayerPrevious
    "next" -> msg.PlayerNext
    "ended" -> msg.MusicEnded
    _ -> {
      echo event
      panic as "shouldnt happen"
    }
  }
}

fn view(m: model.Model) {
  use <- bool.guard(bool.negate(m.confirmed), loading.page())
  use <- bool.guard(m.route == router.Login, login.element())
  let page = case m.route {
    router.Home -> home.element([msg.on_play(msg.Play)])
    router.Search(query) ->
      search.element([msg.on_play(msg.Play), search.query(query)])
    router.Artist(id) ->
      artist.element([
        msg.on_play(msg.Play),
        attribute.attribute("artist-id", id),
        case m.layout {
          model.Desktop -> attribute.class("rounded-md border border-zinc-800")
          model.Mobile -> attribute.none()
        },
      ])
    router.Album(id) -> album.page(m, id)
    router.Song(id) ->
      song.element([
        msg.on_play(msg.Play),
        attribute.attribute("song-id", id),
        case id == m.current_song.id {
          True -> song.song_time(player.time(m.player))
          False -> song.song_time(-1.0)
        },
        case m.layout {
          model.Desktop -> attribute.class("rounded-md border border-zinc-800")
          model.Mobile -> attribute.none()
        },
      ])
    router.Playlist(id) ->
      playlist.element([
        msg.on_playlist(fn(req) { msg.StreamPlaylist(req.playlist, req.index) }),
        msg.on_play(msg.Play),
        attribute.attribute("playlist-id", id),
        attribute.attribute("song-id", m.current_song.id),
      ])
    router.Library -> library.element([msg.on_play(msg.Play)])
    router.Likes ->
      playlist.element([
        msg.on_playlist(fn(req) { msg.StreamPlaylist(req.playlist, req.index) }),
        msg.on_play(msg.Play),
        attribute.attribute(
          "playlist-id",
          constants.somachord_likes_playlist_id,
        ),
        attribute.attribute("song-id", m.current_song.id),
      ])
    router.About -> about.page()
    _ -> error.page(error.NotFound, attribute.none())
  }

  case m.layout {
    model.Mobile -> mobile.view(m, page)
    model.Desktop -> desktop.view(m, page)
  }
}
