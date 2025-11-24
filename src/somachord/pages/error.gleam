import lustre/attribute
import lustre/element
import lustre/element/html
import rsvp

pub type ErrorType {
  NoConnection
  NotFound
  ServerDown
  Generic
}

pub fn page(error_type: ErrorType, button_event: attribute.Attribute(a)) {
  html.div(
    [
      attribute.class(
        "flex-1 h-full flex flex-col items-center justify-center gap-4",
      ),
    ],
    case error_type {
      NoConnection -> no_connection(button_event)
      NotFound -> not_found()
      ServerDown -> server_down()
      Generic -> generic()
    },
  )
}

pub fn from_rsvp(error: rsvp.Error) {
  case error {
    rsvp.NetworkError | rsvp.HttpError(_) -> NoConnection
    _ -> Generic
  }
}

fn no_connection(event: attribute.Attribute(a)) {
  [
    text_section("( ﾟヮﾟ)", "No Connection"),
    html.button(
      [
        attribute.class(
          "rounded-full px-4 py-2 bg-white hover:bg-white/80 text-black",
        ),
        event,
      ],
      [
        element.text("Retry"),
      ],
    ),
  ]
}

fn not_found() {
  [
    text_section("(O_O;)", "Not Found"),
    html.p([], [element.text("there's nothing here....")]),
    html.a([attribute.href("/")], [
      html.button(
        [
          attribute.class(
            "rounded-full px-4 py-2 bg-white hover:bg-white/80 text-black",
          ),
        ],
        [
          element.text("Go Home"),
        ],
      ),
    ]),
  ]
}

fn server_down() {
  [
    text_section("(；一_一)", "Server Down"),
    html.p([], [element.text("i couldn't reach the music server...")]),
  ]
}

fn generic() {
  [
    text_section("ʘ‿ʘ", "Ooops.."),
    html.p([], [element.text("this is odd, can you try again?")]),
  ]
}

fn text_section(face: String, title: String) {
  html.div(
    [attribute.class("text-center font-[Poppins] font-extrabold text-3xl")],
    [
      html.h1([], [element.text(face)]),
      html.h1([], [element.text(title)]),
    ],
  )
}
