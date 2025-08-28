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
          html.h1([], [element.text("(O_O;)")]),
          html.h1([], [element.text("Not Found")]),
        ],
      ),
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
    ],
  )
}
