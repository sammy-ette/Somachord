import gleroglero/solid
import lustre/attribute
import lustre/element
import lustre/element/html
import sonata/components/artist_detail

pub fn page() {
  html.div(
    [
      attribute.class(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500",
      ),
    ],
    [
      html.div(
        [
          attribute.class("relative h-[45%] p-8 flex items-end"),
          attribute.style(
            "background-image",
            "url('https://image-cdn-ak.spotifycdn.com/image/ab676186000001947bba80a0198cfd4a7f6c3c69')",
          ),
          attribute.class("rounded-tl-md bg-cover bg-center"),
        ],
        [
          html.div(
            [
              attribute.class(
                "bg-linear-to-l from-zinc-950 to-zinc-950/20 absolute top-0 left-0 h-full w-full",
              ),
            ],
            [],
          ),
          html.div(
            [attribute.class("z-20 flex items-center justify-between w-full")],
            [
              html.div([], [
                html.h1([attribute.class("font-bold text-5xl")], [
                  element.text("TAEYEON"),
                ]),
              ]),
              html.div([attribute.class("flex items-center")], [
                html.div([attribute.class("flex items-center relative")], [
                  html.div(
                    [
                      attribute.class(
                        "ml-2 z-5 absolute rounded-full bg-black w-8 h-8",
                      ),
                    ],
                    [],
                  ),
                  html.i(
                    [
                      attribute.class(
                        "z-10 ph-fill ph-play-circle text-6xl text-violet-500",
                      ),
                    ],
                    [],
                  ),
                ]),
              ]),
            ],
          ),
        ],
      ),
      artist_detail.element([]),
    ],
  )
}
