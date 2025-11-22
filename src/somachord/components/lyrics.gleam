import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/javascript/array
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import lustre
import lustre/attribute
import lustre/component
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import plinth/browser/document
import plinth/browser/shadow
import rsvp
import somachord/api/api
import somachord/api/models as api_models
import somachord/components
import somachord/model
import somachord/storage
import varasto

pub type Model {
  Model(
    id: String,
    lyricsets: option.Option(List(api_models.LyricSet)),
    // lang of lyric set chosed
    chosen_lyric_set: String,
    song_time: option.Option(Float),
    auto_scroll: Bool,
    font_size: Size,
    show_size_changer: Bool,
    nested_shadow: Bool,
  )
}

pub type Size {
  Small
  Medium
  Large
}

type Msg {
  SongID(id: String)
  Playtime(time: Float)
  LyricsRetrieved(
    Result(Result(List(api_models.LyricSet), api.SubsonicError), rsvp.Error),
  )
  ToggleAutoscroll
  SetAutoscroll(Bool)
  SizeChange(Size)
  ToggleSizeChanger
  NestedShadow(Bool)
  Nothing
}

pub fn register() -> Result(Nil, lustre.Error) {
  let component =
    lustre.component(init, update, view, [
      component.on_attribute_change("song-id", fn(value) { Ok(SongID(value)) }),
      component.on_property_change("time", {
        decode.float |> decode.map(Playtime)
      }),
      component.on_attribute_change("size", fn(value) {
        case value {
          "small" -> Ok(SizeChange(Small))
          "medium" -> Ok(SizeChange(Medium))
          "large" -> Ok(SizeChange(Large))
          _ -> Error(Nil)
        }
      }),
      component.on_property_change("auto-scroll", {
        decode.bool |> decode.map(SetAutoscroll)
      }),
      component.on_property_change("nested-shadow", {
        decode.bool |> decode.map(NestedShadow)
      }),
    ])
  lustre.register(component, "song-lyrics")
}

pub fn element(attrs: List(attribute.Attribute(msg))) -> element.Element(msg) {
  element.element(
    "song-lyrics",
    [attribute.style("--unplayed-color", "var(--color-zinc-600)"), ..attrs],
    [],
  )
}

pub fn id(id: String) -> attribute.Attribute(msg) {
  attribute.attribute("song-id", id)
}

pub fn song_time(time: Float) -> attribute.Attribute(msg) {
  attribute.property("time", json.float(time))
}

pub fn size(size: Size) -> attribute.Attribute(msg) {
  let size_str = case size {
    Small -> "small"
    Medium -> "medium"
    Large -> "large"
  }
  attribute.attribute("size", size_str)
}

pub fn auto_scroll(scroll: Bool) -> attribute.Attribute(msg) {
  attribute.property("auto-scroll", json.bool(scroll))
}

pub fn nested_shadow(nested: Bool) -> attribute.Attribute(msg) {
  attribute.property("nested-shadow", json.bool(nested))
}

pub fn on_load(handler: fn(Bool) -> msg) -> attribute.Attribute(msg) {
  event.on("lyricsLoaded", {
    use loaded <- decode.subfield(["detail", "loaded"], decode.bool)
    decode.success(handler(loaded))
  })
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(
      id: "",
      lyricsets: option.None,
      chosen_lyric_set: "xxx",
      song_time: option.None,
      auto_scroll: True,
      font_size: case components.layout() {
        model.Desktop -> Medium
        model.Mobile -> Small
      },
      show_size_changer: False,
      nested_shadow: False,
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    SongID(id) -> #(m, case storage.create() |> varasto.get("auth") {
      Error(_) -> effect.none()
      Ok(stg) -> {
        use <- bool.guard(id == "", effect.none())
        api.lyrics(stg.auth, id, LyricsRetrieved)
      }
    })
    NestedShadow(nested) -> #(Model(..m, nested_shadow: nested), effect.none())
    Playtime(time) ->
      case m.nested_shadow {
        True -> {
          let ret = #(Model(..m, song_time: option.Some(time)), effect.none())
          use <- bool.guard(bool.negate(m.auto_scroll), ret)
          // song-lyrics is used in song-page (also a component).
          // this is the only way to get its shadow root, and to query for elements in a shadow dom.
          use <- bool.guard(
            document.get_elements_by_tag_name("song-page") |> array.size() == 0,
            ret,
          )
          let assert Ok(parent_elem) =
            document.get_elements_by_tag_name("song-page") |> array.get(0)
          let assert Ok(parent_shadow_root) = shadow.shadow_root(parent_elem)
          let assert Ok(elem) =
            shadow.query_selector(parent_shadow_root, "song-lyrics")
          let assert Ok(shadow_root) = shadow.shadow_root(elem)
          case
            shadow.query_selector_all(shadow_root, ".off-time")
            |> components.elems_to_array
            |> array.to_list
            |> list.take(5)
            |> list.reverse
            |> list.first
          {
            Ok(elem) -> components.scroll_into_view(elem)
            Error(_) -> Nil
          }
          ret
        }
        False -> {
          let ret = #(Model(..m, song_time: option.Some(time)), effect.none())
          use <- bool.guard(bool.negate(m.auto_scroll), ret)
          use <- bool.guard(
            document.get_elements_by_tag_name("song-lyrics") |> array.size()
              == 0,
            ret,
          )
          let assert Ok(elem) =
            document.get_elements_by_tag_name("song-lyrics") |> array.get(0)
          let assert Ok(shadow_root) = shadow.shadow_root(elem)
          case
            shadow.query_selector_all(shadow_root, ".off-time")
            |> components.elems_to_array
            |> array.to_list
            |> list.take(5)
            |> list.reverse
            |> list.first
          {
            Ok(elem) -> components.scroll_into_view(elem)
            Error(_) -> Nil
          }
          ret
        }
      }
    LyricsRetrieved(Error(e)) -> {
      echo e
      panic as "rsvp error"
    }
    LyricsRetrieved(Ok(Error(e))) -> {
      case e {
        api.NotFound -> #(
          Model(..m, lyricsets: option.Some([])),
          emit_lyrics_loaded(False),
        )
        _ -> {
          echo e
          panic as "should be unreachable"
        }
      }
    }
    LyricsRetrieved(Ok(Ok(lyricsets))) -> #(
      Model(..m, lyricsets: option.Some(lyricsets)),
      emit_lyrics_loaded(True),
    )
    ToggleAutoscroll -> #(
      Model(..m, auto_scroll: bool.negate(m.auto_scroll)),
      effect.none(),
    )
    SetAutoscroll(scroll) -> #(Model(..m, auto_scroll: scroll), effect.none())
    ToggleSizeChanger -> #(
      Model(..m, show_size_changer: bool.negate(m.show_size_changer)),
      effect.none(),
    )
    SizeChange(size) -> #(Model(..m, font_size: size), effect.none())
    Nothing -> #(m, effect.none())
  }
}

fn emit_lyrics_loaded(loaded: Bool) {
  event.emit(
    "lyricsLoaded",
    json.object([
      #("loaded", json.bool(loaded)),
    ]),
  )
}

fn view(m: Model) {
  use <- bool.guard(
    m.lyricsets |> option.is_none,
    html.div([attribute.class("flex justify-center w-full h-full")], [
      html.i(
        [
          attribute.class("ph ph-spinner-ball animate-spin text-3xl"),
        ],
        [],
      ),
    ]),
  )

  let lyricsets = m.lyricsets |> option.unwrap([])

  use <- bool.guard(
    lyricsets |> list.is_empty,
    html.h1([attribute.class("font-[Poppins] font-semibold text-3xl")], [
      element.text("No Lyrics Found"),
    ]),
  )

  let lyrics =
    list.find(lyricsets, fn(lyricset: api_models.LyricSet) {
      // chosen_lyric_set defaults to xxx but just in case it isnt
      { lyricset.lang == m.chosen_lyric_set }
      |> bool.or(lyricset.lang == "xxx")
      |> bool.or(lyricset.lang == "und")
    })
    |> result.replace_error(case lyricsets {
      [first, ..] -> first
      _ ->
        api_models.LyricSet(synced: False, lang: "und", offset: 0.0, lines: [])
    })
    |> result.unwrap_both

  html.div(
    [
      attribute.class("space-y-2"),
      attribute.class(case m.font_size {
        Small -> "text-lg"
        Medium -> "text-2xl"
        Large -> "text-4xl/12"
      }),
    ],
    [
      case lyrics.synced {
        False ->
          html.div([attribute.class("flex justify-center items-center gap-1")], [
            html.i(
              [
                attribute.class("text-xl text-yellow-400 ph-fill ph-warning"),
              ],
              [],
            ),
            element.text("Unsynced!"),
          ])
        True -> element.none()
      },
      ..list.map(lyrics.lines, fn(lyric: api_models.Lyric) {
        html.p(
          [
            attribute.class("font-semibold"),
            case m.song_time {
              option.None | option.Some(-1.0) ->
                attribute.class("text-zinc-300")
              option.Some(current_time) ->
                case
                  { current_time +. lyrics.offset } >. { lyric.time -. 0.5 }
                {
                  True -> attribute.class("text-zinc-300")
                  False -> attribute.class("text-(--unplayed-color) off-time")
                }
            },
          ],
          [element.text(lyric.text)],
        )
      })
    ],
  )
}
