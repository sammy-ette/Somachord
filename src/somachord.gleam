import gleam/bool
import gleam/dict
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import gleam/order
import gleam/pair
import gleam/result
import gleam/uri
import plinth/javascript/date
import somachord/components
import somachord/components/playlist_menu
import somachord/constants
import somachord/models/auth
import somachord/pages/library
import somachord/pages/not_found
import somachord/pages/playlist
import somachord/pages/search
import somachord/queue

import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import modem
import plinth/browser/window
import varasto

import player
import somachord/api/api
import somachord/api_helper
import somachord/api_models
import somachord/components/login
import somachord/components/song_detail
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
  let assert Ok(_) = song_detail.register()

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
    )
  case m.storage |> varasto.get("auth") {
    Ok(stg) -> #(
      model.Model(..m, confirmed: True, auth: stg.auth),
      effect.batch([
        modem.init(msg.on_url_change),
        route_effect(m, route),
        player.listen_events(m.player, player_event_handler),
        api.queue(stg.auth, msg.Queue),
        unload_event(),
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

fn update(
  m: model.Model,
  msg: msg.Msg,
) -> #(model.Model, effect.Effect(msg.Msg)) {
  case msg {
    msg.Router(router.ChangeRoute(route)) -> #(
      model.Model(..m, route:),
      route_effect(m, route),
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
        model.Model(..m, queue: queue |> queue.jump(queue.position)),
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
            play()
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
                    panic as "album req fetch failed"
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
        case
          m.shuffled,
          queue.new(songs: album.songs, position: 0, song_position: 0.0)
        {
          True, queue -> queue |> queue.shuffle
          False, queue -> queue
        }
        |> queue.jump(index)
      #(model.Model(..m, queue:), play())
    }
    msg.StreamPlaylist(playlist, index) -> {
      echo playlist.name
      let queue =
        case
          m.shuffled,
          queue.new(songs: playlist.songs, position: 0, song_position: 0.0)
        {
          True, queue -> queue |> queue.shuffle
          False, queue -> queue
        }
        |> queue.jump(index)
      #(model.Model(..m, queue:), play())
    }
    msg.StreamSong(song) | msg.SongRetrieval(Ok(Ok(song))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let stream_uri =
        api_helper.create_uri("/rest/stream.view", auth_details, [
          #("id", song.id),
        ])
        |> uri.to_string

      m.player |> player.load_song(stream_uri, song)
      #(
        model.Model(
          ..m,
          queue: queue.new(songs: [song], song_position: 0.0, position: 0),
        ),
        effect.none(),
      )
    }
    msg.StreamError | msg.SongRetrieval(_) -> todo as "handle stream error"
    msg.PlayerTick(time) -> {
      let playtime = case time {
        0.0 -> 0
        time ->
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
      case m.queue.position == 0, m.player |> player.time() >. 2.0 {
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
      #(
        model.Model(..m, queue: queue.next(m.queue)),
        effect.batch([
          check_scrobble(m),
          case
            int.compare(
              m.queue.position + 1,
              m.queue.songs |> dict.keys |> list.length,
            )
          {
            order.Lt -> play()
            order.Eq -> {
              api.similar_songs(
                auth_details,
                m.current_song.id,
                msg: msg.SimilarSongs,
              )
            }
            _ -> effect.none()
          },
        ]),
      )
    }
    msg.SimilarSongs(Ok(Ok(songs))) | msg.SimilarSongsArtist(Ok(Ok(songs))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let new_songs =
        m.queue.songs
        |> dict.to_list
        |> list.sort(
          fn(a: #(Int, api_models.Child), b: #(Int, api_models.Child)) {
            int.compare(a.0, b.0)
          },
        )
        |> list.map(fn(song: #(Int, api_models.Child)) { song.1 })
        |> list.append(songs)
      #(
        model.Model(..m, queue: queue.new(m.queue.position, new_songs, 0.0)),
        case m.queue.position + 1 == new_songs |> list.length {
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
    // msg.SubsonicResponse(Ok(api_helper.SubsonicError(
    //   code,
    //   message,
    //   attempted_path,
    // ))) -> {
    //   let auth_details = {
    //     let assert Ok(stg) = m.storage |> varasto.get("auth")
    //     stg.auth
    //   }
    //   echo attempted_path
    //   echo code
    //   echo message
    //   case attempted_path {
    //     "/rest/getSimilarSongs.rest" -> {
    //       let assert Ok(first_artist) = m.current_song.artists |> list.first
    //       #(
    //         m,
    //         api.similar_songs_artist(
    //           auth_details,
    //           first_artist.id,
    //           msg: msg.SimilarSongs,
    //         ),
    //       )
    //     }
    //     "/rest/getSimilarSongs2.rest" -> #(
    //       m,
    //       api.save_queue(auth_details, option.None, msg.DisgardedResponse),
    //     )
    //     _ -> #(m, effect.none())
    //   }
    // }
    msg.StreamCurrent -> {
      case queue.current_song(m.queue) {
        option.None -> #(m, effect.none())
        option.Some(song) -> {
          let stream_uri =
            api_helper.create_uri("/rest/stream.view", m.auth, [
              #("id", song.id),
            ])
            |> uri.to_string
          m.player |> player.load_song(stream_uri, song)
          #(
            m,
            api.save_queue(m.auth, option.Some(m.queue), msg.DisgardedResponse),
          )
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
      let stream_uri =
        api_helper.create_uri("/rest/stream.view", auth_details, [
          #("id", song.id),
        ])
        |> uri.to_string
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
    msg.PlayerLoop -> {
      m.player |> player.loop(bool.negate(m.looping))
      #(model.Model(..m, looping: bool.negate(m.looping)), effect.none())
    }
    msg.Like -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      #(
        model.Model(
          ..m,
          current_song: api_models.Child(
            ..m.current_song,
            starred: bool.negate(m.current_song.starred),
          ),
          queue: queue.Queue(
            ..m.queue,
            songs: m.queue.songs
              |> dict.insert(
                m.queue.position,
                api_models.Child(
                  ..m.current_song,
                  starred: bool.negate(m.current_song.starred),
                ),
              ),
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
    msg.PlayerPlaylists -> {
      use <- bool.guard(dict.is_empty(m.playlists) |> bool.negate, #(
        m,
        effect.none(),
      ))

      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      #(m, api.playlists(auth_details, msg.Playlists))
    }
    msg.Playlists(Ok(Ok(playlists))) -> #(
      model.Model(
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
            let assert Ok(stg) = m.storage |> varasto.get("auth")
            stg.auth
          },
          playlist.id,
          msg.PlaylistWithSongs,
        )
      })
        |> effect.batch(),
    )
    msg.Playlists(e) -> {
      echo e
      #(m, effect.none())
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
    msg.AddToPlaylist(playlist_id, song_id) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }

      let assert Ok(playlist) = dict.get(m.playlists, playlist_id)
      let songs = playlist.songs |> list.append([m.current_song])

      #(
        model.Model(
          ..m,
          playlists: m.playlists
            |> dict.insert(playlist_id, api_models.Playlist(..playlist, songs:)),
        ),
        api.add_to_playlist(
          auth_details:,
          playlist_id:,
          song_id:,
          msg: msg.DisgardedResponse,
        ),
      )
    }
    msg.RemoveFromPlaylist(playlist_id, song_id) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }

      let assert Ok(playlist) = dict.get(m.playlists, playlist_id)
      let songs =
        playlist.songs
        |> list.filter(fn(s) { s.id != song_id })
      #(
        model.Model(
          ..m,
          playlists: m.playlists
            |> dict.insert(playlist_id, api_models.Playlist(..playlist, songs:)),
        ),
        api.remove_from_playlist(
          auth_details:,
          playlist_id:,
          song_id:,
          msg: msg.DisgardedResponse,
        ),
      )
    }
    msg.Search(query) -> #(
      m,
      modem.push("/search/" <> query, option.None, option.None),
    )
    msg.ComponentClick | msg.DisgardedResponse(_) -> #(m, effect.none())
    msg.NewPlaylist -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      #(
        m,
        api.create_playlist(
          auth_details:,
          name: "New Playlist",
          songs: [m.current_song],
          msg: msg.CreatePlaylist,
        ),
      )
    }
    msg.CreatePlaylist(Ok(Ok(playlist))) -> {
      #(
        model.Model(
          ..m,
          playlists: m.playlists |> dict.insert(playlist.id, playlist),
        ),
        effect.none(),
      )
    }
    msg.CreatePlaylist(e) -> {
      echo e
      #(m, effect.none())
    }
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
  case m.confirmed {
    False -> element.none()
    True -> {
      let page = case m.route {
        router.Home -> home.element([msg.on_play(msg.Play)])
        router.Search(query) ->
          search.element([msg.on_play(msg.Play), search.query(query)])
        router.Artist(id) ->
          artist.element([
            msg.on_play(msg.Play),
            attribute.attribute("artist-id", id),
            case m.layout {
              model.Desktop ->
                attribute.class("rounded-md border border-zinc-800")
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
              model.Desktop ->
                attribute.class("rounded-md border border-zinc-800")
              model.Mobile -> attribute.none()
            },
          ])
        router.Playlist(id) ->
          playlist.element([
            msg.on_playlist(fn(req) {
              msg.StreamPlaylist(req.playlist, req.index)
            }),
            msg.on_play(msg.Play),
            attribute.attribute("playlist-id", id),
          ])
        router.Library -> library.element([msg.on_play(msg.Play)])
        router.Likes ->
          playlist.element([
            msg.on_playlist(fn(req) {
              msg.StreamPlaylist(req.playlist, req.index)
            }),
            msg.on_play(msg.Play),
            attribute.attribute(
              "playlist-id",
              constants.somachord_likes_playlist_id,
            ),
          ])
        _ -> not_found.page()
      }

      case m.route {
        router.Login -> login.element()
        _ ->
          case m.layout {
            model.Mobile -> mobile.view(m, page)
            model.Desktop -> desktop.view(m, page)
          }
      }
    }
  }
}
