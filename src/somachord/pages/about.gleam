import lustre/attribute
import lustre/element
import lustre/element/html
import somachord/constants

pub fn page() {
  html.div(
    [
      attribute.class(
        "flex-1 flex flex-col gap-4 p-8 rounded-md border border-zinc-800",
      ),
    ],
    [
      html.h1([attribute.class("text-7xl font-black")], [
        element.text("Somachord"),
      ]),
      html.h2([attribute.class("text-xl text-zinc-500 font-bold")], [
        element.text("Version " <> constants.version),
      ]),
      html.div([attribute.class("flex flex-col gap-2")], [
        html.span([], [
          element.text("Created by "),
          html.a(
            [
              attribute.class("text-violet-400 inline-flex items-center gap-1"),
              attribute.target("_blank"),
              attribute.href("https://sammyette.party/"),
            ],
            [
              element.text("sammyette"),
              html.i([attribute.class("ph ph-arrow-up-right self-center")], []),
            ],
          ),
        ]),
        html.span([], [
          element.text("GitHub: "),
          html.a(
            [
              attribute.class("text-violet-400 inline-flex items-center gap-1"),
              attribute.target("_blank"),
              attribute.href("https://github.com/sammy-ette/Somachord"),
            ],
            [
              element.text("https://github.com/sammy-ette/Somachord"),
              html.i([attribute.class("ph ph-arrow-up-right self-center")], []),
            ],
          ),
        ]),
      ]),
    ],
  )
}
