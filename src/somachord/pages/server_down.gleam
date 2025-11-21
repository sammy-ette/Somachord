import lustre/attribute
import lustre/element
import lustre/element/html

pub fn page() {
  html.div(
    [attribute.class("flex-1 flex flex-col items-center justify-center gap-4")],
    [
      html.div(
        [attribute.class("text-center font-[Poppins] font-extrabold text-3xl")],
        [
          html.h1([], [element.text("(；一_一)")]),
          html.h1([], [element.text("Server Down")]),
        ],
      ),
      html.p([], [element.text("i couldn't reach the music server...")]),
    ],
  )
}
