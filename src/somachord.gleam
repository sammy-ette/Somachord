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
import somachord/pages/not_found
import somachord/pages/search

import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import modem
import plinth/browser/window
import varasto

import player
import somachord/api
import somachord/api_helper
import somachord/components/login
import somachord/components/song_detail
import somachord/model
import somachord/msg
import somachord/pages/album
import somachord/pages/artist
import somachord/pages/home
import somachord/pages/song
import somachord/router
import somachord/storage
import somachord/view/desktop
import somachord/view/mobile

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = login.register()
  let assert Ok(_) = home.register()
  let assert Ok(_) = artist.register()
  let assert Ok(_) = song.register()
  let assert Ok(_) = song_detail.register()
  let assert Ok(_) = search.register()
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

  let layout = case window.self() |> window.inner_width() < 800 {
    True -> model.Mobile
    False -> model.Desktop
  }

  echo layout

  let m =
    model.Model(
      route:,
      layout:,
      storage: storage.create(),
      confirmed: False,
      albums: dict.new(),
      player: player.new(),
      queue: model.Queue(
        song_position: 0.0,
        position: 0,
        songs: dict.new(),
        changed: date.now(),
      ),
      current_song: model.new_song(),
      seeking: False,
      seek_amount: 0,
      played_seconds: 0,
      looping: False,
    )
  case m.storage |> varasto.get("auth") {
    Ok(stg) -> #(
      model.Model(..m, confirmed: True),
      effect.batch([
        modem.init(msg.on_url_change),
        route_effect(m, route),
        player.listen_events(m.player, player_event_handler),
        api.queue(stg.auth),
        unload_event(),
      ]),
    )
    Error(_) ->
      case router.get_route() |> router.uri_to_route {
        router.Login -> #(
          model.Model(..m, confirmed: True),
          modem.init(msg.on_url_change),
        )
        _ -> {
          let assert Ok(login) = uri.parse("/login")

          #(m, modem.load(login))
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
      api.album(auth_details, id)
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
    msg.SubsonicResponse(Ok(api_helper.Album(album))) -> #(
      model.Model(..m, albums: m.albums |> dict.insert(album.id, album)),
      effect.none(),
    )
    msg.SubsonicResponse(Ok(api_helper.Queue(queue))) -> {
      // we dont want to use the queue if its older than 2 hours
      let queue_time_range = date.get_time(date.now()) - { 2 * 60 * 60 * 1000 }
      echo queue.changed
      #(
        model.Model(..m, queue:),
        case queue.changed |> date.get_time() < queue_time_range {
          True ->
            api.save_queue(
              {
                let assert Ok(stg) = m.storage |> varasto.get("auth")
                stg.auth
              },
              option.None,
            )
          False -> {
            m.player
            |> player.seek(queue.song_position |> float.truncate)
            play_from_queue(queue.position)
          }
        },
      )
    }
    msg.Unload -> #(
      m,
      api.save_queue(
        {
          let assert Ok(stg) = m.storage |> varasto.get("auth")
          stg.auth
        },
        option.Some(
          model.Queue(..m.queue, song_position: m.player |> player.time),
        ),
      ),
    )
    msg.SubsonicResponse(Error(e)) -> {
      echo e
      #(m, effect.none())
    }
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
              echo "already have album"
              let assert Ok(album) = m.albums |> dict.get(req.id)
              msg.StreamAlbum(album) |> dispatch
            }),
          ))
          #(
            m,
            api.album(auth_details:, id: req.id)
              |> effect.map(fn(message: msg.Msg) {
                case message {
                  msg.SubsonicResponse(Error(e)) ->
                    msg.SubsonicResponse(Error(e))
                  msg.SubsonicResponse(Ok(api_helper.Album(album))) ->
                    msg.StreamAlbum(album)
                  m -> m
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
    msg.StreamAlbum(album) -> {
      #(
        model.Model(
          ..m,
          queue: model.Queue(
            position: 0,
            song_position: 0.0,
            songs: album.songs
              |> list.fold(#(dict.new(), 0), fn(acc, song) {
                let #(d, idx) = acc
                #(d |> dict.insert(idx, song), idx + 1)
              })
              |> pair.first,
            changed: date.now(),
          ),
        ),
        play_from_queue(0),
      )
    }
    msg.StreamSong(song) | msg.SongRetrieval(Ok(api_helper.Song(song))) -> {
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
          queue: model.Queue(
            song_position: 0.0,
            songs: dict.new() |> dict.insert(0, song),
            position: 0,
            changed: date.now(),
          ),
        ),
        effect.none(),
      )
    }
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
        ),
      )
    }
    msg.PlayerPrevious -> {
      #(m, case m.queue.position == 0, m.player |> player.time() >. 5.0 {
        False, False -> play_from_queue(m.queue.position - 1)
        _, True -> {
          m.player |> player.beginning()
          effect.none()
        }
        _, _ -> effect.none()
      })
    }
    msg.MusicEnded | msg.PlayerNext -> {
      #(
        m,
        effect.batch([
          check_scrobble(m),
          case
            int.compare(
              m.queue.position + 1,
              m.queue.songs |> dict.keys |> list.length,
            )
          {
            order.Lt -> play_from_queue(m.queue.position + 1)
            order.Eq -> {
              let auth_details = {
                let assert Ok(stg) = m.storage |> varasto.get("auth")
                stg.auth
              }
              api.similar_songs(auth_details, m.current_song.id)
            }
            _ -> effect.none()
          },
        ]),
      )
    }
    msg.SubsonicResponse(Ok(api_helper.SimilarSongs(songs))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      echo m.queue.position + 1
      let new_queue =
        songs
        |> list.filter(fn(song) {
          m.queue.songs
          |> dict.values()
          |> list.find(fn(potential_song) { potential_song.id == song.id })
          |> result.is_error
        })
        |> list.fold(
          #(dict.new(), m.queue.songs |> dict.keys |> list.length),
          fn(acc, song) {
            let #(d, idx) = acc
            #(d |> dict.insert(idx, song), idx + 1)
          },
        )
        |> pair.first
        |> dict.merge(m.queue.songs)
      #(
        model.Model(..m, queue: model.Queue(..m.queue, songs: new_queue)),
        case m.queue.position + 1 == new_queue |> dict.keys |> list.length {
          False -> play_from_queue(m.queue.position + 1)
          True -> {
            let assert Ok(first_artist) = m.current_song.artists |> list.first
            api.similar_songs_artist(auth_details, first_artist.id)
          }
        },
      )
    }
    msg.SubsonicResponse(Ok(api_helper.SubsonicError(
      code,
      message,
      attempted_path,
    ))) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      echo attempted_path
      echo code
      echo message
      case attempted_path {
        "/rest/getSimilarSongs.rest" -> {
          let assert Ok(first_artist) = m.current_song.artists |> list.first
          #(m, api.similar_songs_artist(auth_details, first_artist.id))
        }
        _ -> #(m, effect.none())
      }
    }
    msg.StreamFromQueue(position) -> {
      let auth_details = {
        let assert Ok(stg) = m.storage |> varasto.get("auth")
        stg.auth
      }
      let assert Ok(song) = m.queue.songs |> dict.get(position)
      let stream_uri =
        api_helper.create_uri("/rest/stream.view", auth_details, [
          #("id", song.id),
        ])
        |> uri.to_string
      let modified_queue = model.Queue(..m.queue, position:)
      m.player |> player.load_song(stream_uri, song)
      #(
        model.Model(..m, queue: modified_queue),
        api.save_queue(auth_details, option.Some(modified_queue)),
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
            model.Queue(..m.queue, song_position: m.player |> player.time),
          ),
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
      m.player |> player.loop()
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
          current_song: model.Child(
            ..m.current_song,
            starred: bool.negate(m.current_song.starred),
          ),
          queue: model.Queue(
            ..m.queue,
            songs: m.queue.songs
              |> dict.insert(
                m.queue.position,
                model.Child(
                  ..m.current_song,
                  starred: bool.negate(m.current_song.starred),
                ),
              ),
          ),
        ),
        case m.current_song.starred {
          False -> api.like(auth_details, m.current_song.id)
          True -> api.unlike(auth_details, m.current_song.id)
        },
      )
    }
    msg.Search(query) -> #(
      m,
      modem.push("/search/" <> query, option.None, option.None),
    )
    _ -> #(m, effect.none())
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
      )
    False -> effect.none()
  }
}

fn play_from_queue(position: Int) {
  effect.from(fn(dispatch) { msg.StreamFromQueue(position) |> dispatch })
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
          ])
        router.Album(id) -> album.page(m, id)
        router.Song(id) ->
          song.element([
            msg.on_play(msg.Play),
            attribute.attribute("song-id", id),
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
