import gleam/dynamic/decode
import gleam/uri
import lustre/attribute
import lustre/event
import rsvp
import sonata/api_helper
import sonata/model
import sonata/router

pub type Msg {
  Router(router.Msg)
  SubsonicResponse(Result(api_helper.Response, rsvp.Error))
  SongRetrieval(Result(api_helper.Response, rsvp.Error))
  // dispatches the appropriate msg (StreamAlbum, StreamSong)
  // based on PlayRequest. because its "light data"
  // that comes from components (only id for song/album/artist)
  Play(model.PlayRequest)

  // handles actually playing the music in the browser
  // and the queue.
  StreamAlbum(model.Album)
  StreamSong(model.Child)

  // player events
  ProgressDrag(Int)
  PlayerSeek(Int)
  PlayerSongLoaded(model.Child)
  PlayerTick(time: Float)
  MusicEnded
  // player msgs (user interactions)
  PlayerPrevious
  PlayerPausePlay
  PlayerNext
  Like

  ComponentClick
}

pub type SongPageMsg {
  SongID(String)
  PlaySong
  SongResponse(Result(api_helper.Response, rsvp.Error))
  Nothing
}

pub fn on_url_change(url: uri.Uri) -> Msg {
  router.uri_to_route(url) |> router.ChangeRoute |> Router
}

pub fn on_play(
  handler: fn(model.PlayRequest) -> msg,
) -> attribute.Attribute(msg) {
  event.on("play", {
    use type_ <- decode.subfield(["detail", "type"], decode.string)
    use id <- decode.subfield(["detail", "id"], decode.string)

    decode.success(model.PlayRequest(type_:, id:)) |> decode.map(handler)
  })
}
