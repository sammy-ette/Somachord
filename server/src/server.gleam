import envoy
import gleam/erlang/process
import gleam/result

import lustre/attribute.{attribute}
import lustre/element
import lustre/element/html
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  let assert Ok(_) =
    wisp_mist.handler(handle_request, wisp.random_string(64))
    |> mist.new
    |> mist.bind("0.0.0.0")
    |> mist.port(8000)
    |> mist.start

  process.sleep_forever()
}

pub fn handle_request(req: wisp.Request) -> wisp.Response {
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  use <- wisp.serve_static(req, under: "/static", from: "../priv/static")

  let body =
    html.html(
      [attribute.class("bg-zinc-950 text-white"), attribute("lang", "en")],
      [
        html.head([], [
          html.meta([attribute.charset("UTF-8")]),
          html.meta([
            attribute.content("width=device-width,initial-scale=1"),
            attribute.name("viewport"),
          ]),
          html.link([
            attribute.href("/static/manifest.json"),
            attribute.rel("manifest"),
          ]),
          html.link([
            attribute.href("https://fonts.googleapis.com"),
            attribute.rel("preconnect"),
          ]),
          html.link([
            attribute("crossorigin", ""),
            attribute.href("https://fonts.gstatic.com"),
            attribute.rel("preconnect"),
          ]),
          html.link([
            attribute.rel("stylesheet"),
            attribute.href(
              "https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap",
            ),
          ]),
          html.link([
            attribute.href(
              "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css",
            ),
            attribute.type_("text/css"),
            attribute.rel("stylesheet"),
          ]),
          html.link([
            attribute.href(
              "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css",
            ),
            attribute.type_("text/css"),
            attribute.rel("stylesheet"),
          ]),
          html.link([
            attribute.href("/static/somachord.min.css"),
            attribute("as", "style"),
            attribute.rel("preload"),
          ]),
          html.link([
            attribute.href("/static/somachord.min.css"),
            attribute.rel("stylesheet"),
          ]),
          html.style(
            [],
            "
    .wavy-circle {
      --s: 300px; /* adjust to control the size */

      width: var(--s); 
      aspect-ratio: 1;
      --g:/calc(var(--s)*0.195) calc(var(--s)*0.195) radial-gradient(50% 50%,#000 99%,#0000 101%) no-repeat;
      mask: calc(50% + var(--s)*0.378) calc(50% + var(--s)*0) var(--g),calc(50% + var(--s)*0.327) calc(50% + var(--s)*0.189) var(--g),calc(50% + var(--s)*0.189) calc(50% + var(--s)*0.327) var(--g),calc(50% + var(--s)*0) calc(50% + var(--s)*0.378) var(--g),calc(50% + var(--s)*-0.189) calc(50% + var(--s)*0.327) var(--g),calc(50% + var(--s)*-0.327) calc(50% + var(--s)*0.189) var(--g),calc(50% + var(--s)*-0.378) calc(50% + var(--s)*0) var(--g),calc(50% + var(--s)*-0.327) calc(50% + var(--s)*-0.189) var(--g),calc(50% + var(--s)*-0.189) calc(50% + var(--s)*-0.327) var(--g),calc(50% + var(--s)*0) calc(50% + var(--s)*-0.378) var(--g),calc(50% + var(--s)*0.189) calc(50% + var(--s)*-0.327) var(--g),calc(50% + var(--s)*0.327) calc(50% + var(--s)*-0.189) var(--g),radial-gradient(calc(var(--s)*0.452),#000 99%,#0000 101%) subtract,calc(50% + var(--s)*0.516) calc(50% + var(--s)*0.138) var(--g),calc(50% + var(--s)*0.378) calc(50% + var(--s)*0.378) var(--g),calc(50% + var(--s)*0.138) calc(50% + var(--s)*0.516) var(--g),calc(50% + var(--s)*-0.138) calc(50% + var(--s)*0.516) var(--g),calc(50% + var(--s)*-0.378) calc(50% + var(--s)*0.378) var(--g),calc(50% + var(--s)*-0.516) calc(50% + var(--s)*0.138) var(--g),calc(50% + var(--s)*-0.516) calc(50% + var(--s)*-0.138) var(--g),calc(50% + var(--s)*-0.378) calc(50% + var(--s)*-0.378) var(--g),calc(50% + var(--s)*-0.138) calc(50% + var(--s)*-0.516) var(--g),calc(50% + var(--s)*0.138) calc(50% + var(--s)*-0.516) var(--g),calc(50% + var(--s)*0.378) calc(50% + var(--s)*-0.378) var(--g),calc(50% + var(--s)*0.516) calc(50% + var(--s)*-0.138) var(--g);
    }
  ",
          ),
          html.title([], "Somachord"),
          html.script([], "window.somachordConfig = {
          SERVER_URL: '" <> result.unwrap(envoy.get("SERVER_URL"), "") <> "'
          }"),
        ]),
        html.body(
          [attribute.class("w-screen h-screen flex"), attribute.id("app")],
          [
            html.div([attribute.id("app")], []),
            html.script(
              [
                attribute("async", ""),
                attribute.src("/static/somachord.min.mjs"),
                attribute.type_("module"),
              ],
              "",
            ),
          ],
        ),
      ],
    )
    |> element.to_document_string_tree
  wisp.html_response(body, 200)
}
