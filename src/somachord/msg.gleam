import electron
import gleam/dynamic/decode
import gleam/uri
import lustre/attribute
import lustre/event
import rsvp
import somachord/api/api
import somachord/queue

import somachord/api_models
import somachord/model
import somachord/router

pub type Msg {
  Router(router.Msg)
  SongRetrieval(Result(Result(api_models.Child, api.SubsonicError), rsvp.Error))
  Queue(Result(Result(queue.Queue, api.SubsonicError), rsvp.Error))
  AlbumRetrieved(
    Result(Result(api_models.Album, api.SubsonicError), rsvp.Error),
  )
  DisgardedResponse(Result(Result(Nil, api.SubsonicError), rsvp.Error))
  SimilarSongs(
    Result(Result(List(api_models.Child), api.SubsonicError), rsvp.Error),
  )
  SimilarSongsArtist(
    Result(Result(List(api_models.Child), api.SubsonicError), rsvp.Error),
  )
  PlaylistWithSongs(
    Result(Result(api_models.Playlist, api.SubsonicError), rsvp.Error),
  )

  ToggleFullscreenPlayer
  ChangeFullscreenPlayerView(model.FullscreenPlayerDisplay)

  // dispatches the appropriate msg (StreamAlbum, StreamSong)
  // based on PlayRequest. because its "light data"
  // that comes from components (only id for song/album/artist)
  Play(model.PlayRequest)
  CurrentSongPalette(model.Palette)

  Search(query: String)

  // handles actually playing the music in the browser
  // and the queue.
  StreamAlbum(api_models.Album, Int)
  StreamPlaylist(api_models.Playlist, Int)
  StreamAlbumShuffled(api_models.Album, Int)
  StreamSong(api_models.Child)
  StreamFromQueue(queue_position: Int)
  StreamCurrent
  StreamError
  LoadSong

  // player events
  ProgressDrag(Int)
  PlayerSeek(Float)
  PlayerSongLoaded(api_models.Child)
  PlayerTick(time: Float)
  MusicEnded

  // player msgs (user interactions)
  PlayerShuffle
  PlayerPrevious
  PlayerPausePlay
  PlayerNext
  PlayerLoop
  Like
  QueueJumpTo(position: Int)

  Unload
  ComponentClick
}

pub fn on_url_change(url: uri.Uri) -> Msg {
  router.uri_to_route(case electron.am_i_electron() {
    False -> url
    True -> {
      let assert Ok(url) = uri.parse("/#" <> url.path)
      url
    }
  })
  |> router.ChangeRoute
  |> Router
}

pub fn on_play(
  handler: fn(model.PlayRequest) -> msg,
) -> attribute.Attribute(msg) {
  event.on("play", {
    use type_ <- decode.subfield(["detail", "type"], decode.string)
    use id <- decode.subfield(["detail", "id"], decode.string)
    use index <- decode.then(decode.optionally_at(
      ["detail", "index"],
      0,
      decode.int,
    ))

    decode.success(model.PlayRequest(type_:, id:, index:))
    |> decode.map(handler)
  })
}

pub fn on_playlist(
  handler: fn(model.PlaylistPlayRequest) -> msg,
) -> attribute.Attribute(msg) {
  event.on("playPlaylist", {
    use playlist <- decode.subfield(
      ["detail", "playlist"],
      api_models.playlist_decoder(),
    )
    use index <- decode.then(decode.optionally_at(
      ["detail", "index"],
      0,
      decode.int,
    ))

    decode.success(model.PlaylistPlayRequest(playlist, index))
    |> decode.map(handler)
  })
}
