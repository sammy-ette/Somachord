import gleam/float
import gleam/int
import gleam/list
import gleam/uri
import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/event
import player
import somachord/api_helper
import somachord/api_models
import somachord/model
import somachord/msg
import somachord/router
import varasto

pub fn view(m: model.Model, page) {
  let auth_details = {
    let assert Ok(stg) = m.storage |> varasto.get("auth")
    stg.auth
  }

  html.div(
    [
      attribute.class(
        "font-['Poppins'] w-full flex flex-col pb-4 gap-2 overflow-hidden min-w-0 min-h-0 w-full h-full",
      ),
    ],
    [
      page,
      html.div(
        [
          attribute.class(
            "self-center absolute bottom-28 p-3 rounded-md flex flex-col gap-2 bg-zinc-900 w-[96%]",
          ),
        ],
        [
          html.div([attribute.class("flex justify-between")], [
            html.div([attribute.class("flex gap-2 items-center")], [
              html.div(
                [
                  attribute.class(
                    "w-14 h-14 bg-zinc-900 rounded-md flex items-center justify-center",
                  ),
                ],
                [
                  case m.current_song.cover_art_id == "" {
                    True ->
                      html.i(
                        [
                          attribute.class(
                            "text-zinc-500 text-3xl ph ph-music-notes-simple",
                          ),
                        ],
                        [],
                      )
                    False ->
                      html.a(
                        [attribute.href("/album/" <> m.current_song.album_id)],
                        [
                          html.img([
                            attribute.src(
                              api_helper.create_uri(
                                "/rest/getCoverArt.view",
                                auth_details,
                                [
                                  #("id", m.current_song.cover_art_id),
                                  #("size", "500"),
                                ],
                              )
                              |> uri.to_string,
                            ),
                            attribute.class(
                              "hover:opacity-50 transition-all duration-200 rounded-md object-cover",
                            ),
                          ]),
                        ],
                      )
                  },
                ],
              ),
              html.span([attribute.class("flex flex-col")], [
                html.a([attribute.href("/song/" <> m.current_song.id)], [
                  html.span(
                    [
                      attribute.class(
                        "hover:underline font-normal text-nowrap text-ellipsis",
                      ),
                    ],
                    [
                      element.text(m.current_song.title),
                    ],
                  ),
                ]),
                html.span(
                  [],
                  list.map(
                    m.current_song.artists,
                    fn(artist: api_models.SmallArtist) {
                      html.a([attribute.href("/artist/" <> artist.id)], [
                        html.span(
                          [
                            attribute.class(
                              "hover:underline font-light text-sm",
                            ),
                          ],
                          [element.text(artist.name)],
                        ),
                      ])
                    },
                  )
                    |> list.intersperse(element.text(", ")),
                ),
              ]),
            ]),
            html.div([attribute.class("flex gap-4 items-center")], [
              html.i(
                [
                  attribute.class("text-xl ph-fill ph-skip-back"),
                  event.on_click(msg.PlayerPrevious),
                ],
                [],
              ),
              html.i(
                [
                  attribute.class("text-xl ph-fill ph-skip-forward"),
                  event.on_click(msg.PlayerNext),
                ],
                [],
              ),
              html.i(
                [
                  attribute.class("text-2xl ph-fill"),
                  case m.player |> player.is_paused {
                    False -> attribute.class("ph-pause")
                    True -> attribute.class("ph-play")
                  },
                  event.on_click(msg.PlayerPausePlay),
                ],
                [],
              ),
            ]),
          ]),
          html.div(
            [
              attribute.class("bg-zinc-100 rounded-full h-1"),
              attribute.style(
                "width",
                float.to_string(
                  case m.seeking {
                    True -> int.to_float(m.seek_amount)
                    False -> m.player |> player.time()
                  }
                  /. int.to_float(m.current_song.duration)
                  *. 100.0,
                )
                  <> "%",
              ),
            ],
            [],
          ),
        ],
      ),
      // todo: figure out how to make this stick to the bottom while having scroll
      html.div([attribute.class("")], [
        html.div([attribute.class("flex justify-evenly")], [
          html.a([attribute.href("/")], [
            mobile_nav_button(
              html.i([attribute.class("text-3xl ph ph-house")], []),
              html.i([attribute.class("text-3xl ph-fill ph-house")], []),
              "Home",
              m.route == router.Home,
              [],
            ),
          ]),
          // mobile_nav_button(
          //   html.i([attribute.class("text-3xl ph ph-sparkles")], []),
          //   html.i([attribute.class("text-3xl ph-fill ph-sparkles")], []),
          //   "Discover",
          //   False,
          //   [],
          // ),
          html.a([attribute.href("/search")], [
            mobile_nav_button(
              html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
              html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
              "Search",
              case m.route {
                router.Search(_) -> True
                _ -> False
              },
              [],
            ),
          ]),
          // mobile_nav_button(
        //   html.i([attribute.class("text-3xl ph ph-cards-three")], []),
        //   html.i([attribute.class("text-3xl ph ph-cards-three")], []),
        //   "Library",
        //   False,
        //   [],
        // ),
        ]),
      ]),
    ],
  )
}

fn mobile_nav_button(inactive, active, name, is_active, attrs) {
  html.div(
    [
      attribute.class("flex flex-col gap-2 items-center py-2 px-4 rounded-md"),
      case is_active {
        True -> attribute.class("bg-zinc-900 text-zinc-100")
        False -> attribute.class("text-zinc-500")
      },
      ..attrs
    ],
    [
      html.div([attribute.class("h-8 w-8")], [
        case is_active {
          True -> active
          False -> inactive
        },
      ]),
      html.h1([], [element.text(name)]),
    ],
  )
}
