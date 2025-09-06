import gleam/dynamic/decode
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
import rsvp
import somachord/api/api
import somachord/api_helper
import somachord/api_models
import somachord/components
import somachord/storage
import varasto

import somachord/components/song_detail
import somachord/elements

pub fn register() {
  let app =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(value) { Ok(value |> SongID) }),
      component.on_property_change("time", {
        decode.float |> decode.map(Playtime)
      }),
    ])
  lustre.register(app, "song-page")
}

pub fn element(attrs: List(attribute.Attribute(a))) {
  element.element(
    "song-page",
    [
      attribute.class(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-none [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
      ),
      ..attrs
    ],
    [],
  )
}

pub const song_time = song_detail.song_time

pub type Model {
  Model(song: api_models.Child, playtime: option.Option(Float))
}

pub type Msg {
  SongID(String)
  PlaySong
  SongResponse(Result(Result(api_models.Child, api.SubsonicError), rsvp.Error))
  Nothing
  Playtime(Float)
}

fn init(_) {
  #(Model(song: api_models.new_song(), playtime: option.None), effect.none())
}

fn update(m: Model, msg: Msg) {
  case msg {
    SongID(id) -> #(
      m,
      api.song(
        {
          let assert Ok(stg) = storage.create() |> varasto.get("auth")
          stg.auth
        },
        id:,
        msg: SongResponse,
      ),
    )
    SongResponse(Ok(Ok(song))) -> #(Model(..m, song:), effect.none())
    PlaySong -> #(
      m,
      event.emit(
        "play",
        json.object([
          #("type", json.string("song")),
          #("id", json.string(m.song.id)),
        ]),
      ),
    )
    Playtime(time) -> #(Model(..m, playtime: option.Some(time)), effect.none())
    _ -> #(m, effect.none())
  }
}

fn view(m: Model) {
  let song = m.song
  let auth_details = {
    let assert Ok(stg) = storage.create() |> varasto.get("auth")
    stg.auth
  }

  html.div([components.redirect_click(Nothing)], [
    html.div([attribute.class("flex gap-8 p-8")], [
      case song.id {
        // when song hasnt been retrieved yet
        "" ->
          html.div([attribute.class("w-80 h-80 rounded-md bg-zinc-800")], [])
        _ ->
          html.img([
            attribute.src(
              api_helper.create_uri("/rest/getCoverArt.view", auth_details, [
                #("id", song.cover_art_id),
                #("size", "500"),
              ])
              |> uri.to_string,
            ),
            attribute.class("w-80 h-80 object-cover rounded-md"),
          ])
      },
      html.div([attribute.class("flex flex-col gap-4")], [
        html.h1([attribute.class("text-3xl text-zinc-300 font-semibold")], [
          element.text(song.title),
        ]),
        html.div(
          [attribute.class("flex gap-3 text-xs text-zinc-400 items-center")],
          [
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-user-sound")], []),
              html.span(
                [attribute.class("text-zinc-300")],
                list.map(song.artists, fn(artist: api_models.SmallArtist) {
                  html.a([attribute.href("/artist/" <> artist.id)], [
                    html.span(
                      [
                        attribute.class("hover:underline font-light text-sm"),
                      ],
                      [element.text(artist.name)],
                    ),
                  ])
                })
                  |> list.intersperse(element.text(", ")),
              ),
            ]),
            html.span([], [element.text("•")]),
            html.span([attribute.class("flex gap-2 items-center")], [
              html.i([attribute.class("text-xl ph ph-vinyl-record")], []),
              html.a([attribute.href("/album/" <> song.album_id)], [
                html.span([attribute.class("hover:underline text-zinc-300")], [
                  element.text(song.album_name),
                ]),
              ]),
            ]),
            html.span([], [element.text("•")]),
            html.span([], [element.text(song.year |> int.to_string)]),
            html.span([], [element.text("•")]),
            elements.time(song.duration, []),
            ..case song.plays > 0 {
              False -> [element.none()]
              True -> [
                html.span([], [element.text("•")]),
                html.span([], [
                  element.text(
                    song.plays |> int.to_string
                    <> " play"
                    <> case song.plays == 1 {
                      False -> "s"
                      True -> ""
                    },
                  ),
                ]),
              ]
            }
          ],
        ),
        html.div(
          [attribute.class("text-zinc-400 flex gap-4 items-center -ml-1")],
          [
            html.i(
              [
                attribute.class(
                  "text-5xl text-violet-500 ph-fill ph-play-circle",
                ),
                event.on_click(PlaySong),
              ],
              [],
            ),
            html.i([attribute.class("text-3xl ph ph-plus-circle")], []),
            html.i([attribute.class("text-3xl ph ph-download-simple")], []),
            html.i([attribute.class("text-3xl ph ph-link")], []),
            html.i([attribute.class("text-3xl ph ph-dots-three")], []),
          ],
        ),
        // html.div([attribute.class("flex flex-wrap gap-4")], [
      //   elements.tag("K-Pop"),
      //   elements.tag("R&B"),
      // ]),
      ]),
    ]),
    song_detail.element([
      song_detail.id(song.id),
      case m.playtime {
        option.None -> attribute.none()
        option.Some(time) -> song_detail.song_time(time)
      },
    ]),
  ])
}
