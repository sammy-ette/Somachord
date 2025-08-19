import lustre/attribute
import lustre/element
import lustre/element/html
import sonata/model
import sonata/router

pub fn view(m: model.Model, page) {
  html.div(
    [
      attribute.class(
        "font-['Poppins'] h-screen w-screen flex relative flex-col p-4 gap-2 overflow-none",
      ),
    ],
    [
      page,
      // todo: figure out how to make this stick to the bottom while having scroll
      html.div([attribute.class("")], [
        html.div([attribute.class("flex justify-evenly")], [
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-house")], []),
            html.i([attribute.class("text-3xl ph-fill ph-house")], []),
            "Home",
            m.route == router.Home,
            [],
          ),
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-sparkles")], []),
            html.i([attribute.class("text-3xl ph-fill ph-sparkles")], []),
            "Discover",
            False,
            [],
          ),
          mobile_nav_button(
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            html.i([attribute.class("text-3xl ph ph-magnifying-glass")], []),
            "Search",
            False,
            [],
          ),
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
      attribute.class("flex flex-col gap-2 items-center"),
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
