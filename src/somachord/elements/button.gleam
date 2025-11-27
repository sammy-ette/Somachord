import lustre/attribute
import lustre/element/html

pub type Size {
  // text-xl
  Smallest
  // text-2xl
  Small
  // text-3xl
  Medium
  // text-4xl
  Large
  // text-5xl
  Largest
  Custom(class: String)
}

pub type Kind {
  Play
  Pause
  SkipForward
  SkipBackward
  Loop
  Shuffle
  Like(filled: Bool)
  AddToPlaylist
  FullscreenPlayer
  MoreHorizontal
  Down
  Edit
  Close
}

pub fn button(
  kind kind: Kind,
  size size: Size,
  attrs attrs: List(attribute.Attribute(s)),
) {
  html.button([attribute.class("flex outline-none")], [
    html.i(
      [
        attribute.class(button_class(kind)),
        attribute.class(button_size(size)),
        attribute.class(
          "select-none transition-scale duration-300 hover:scale-[105%] hover:brightness-80 active:brightness-50 "
          <> case size {
            Large -> "active:scale-[90%]"
            _ -> "active:scale-[95%]"
          },
        ),
        ..attrs
      ],
      [],
    ),
  ])
}

pub fn disabled_button(
  kind kind: Kind,
  size size: Size,
  attrs attrs: List(attribute.Attribute(s)),
) {
  html.button([attribute.class("flex outline-none"), attribute.disabled(True)], [
    html.i(
      [
        attribute.class(button_class(kind)),
        attribute.class(button_size(size)),
        attribute.class("cursor-not-allowed"),
        ..attrs
      ],
      [],
    ),
  ])
}

fn button_size(size: Size) {
  case size {
    Smallest -> "text-xl"
    Small -> "text-2xl"
    Medium -> "text-3xl"
    Large -> "text-4xl"
    Largest -> "text-5xl"
    Custom(class) -> class
  }
}

fn button_class(kind: Kind) {
  case kind {
    Play -> "ph-fill ph-play-circle"
    Pause -> "ph-fill ph-pause-circle"
    SkipForward -> "ph-fill ph-skip-forward"
    SkipBackward -> "ph-fill ph-skip-back"
    Loop -> "ph ph-repeat-once"
    Shuffle -> "ph ph-shuffle-simple"
    Like(filled) ->
      case filled {
        True -> "ph-fill ph-heart-straight"
        False -> "ph ph-heart-straight"
      }
    AddToPlaylist -> "ph ph-plus-circle"
    FullscreenPlayer -> "ph ph-monitor"
    MoreHorizontal -> "ph ph-dots-three"
    Down -> "ph ph-caret-down"
    Edit -> "ph ph-pencil-simple"
    Close -> "ph ph-x"
  }
}
